const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const developmentPlansRouter = require('./routes/developmentPlans');
const developmentStepsRouter = require('./routes/developmentSteps');
const { simulateOpenAIResponse } = require('./openai-handler');
const app = express();

app.use(express.static('public'));

app.use(bodyParser.json());

app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads';
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const dbName = req.body.dbname;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, dbName + ext);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!(/\.(sqlite|db)$/i).test(file.originalname)) {
      return cb(new Error('Only SQLite database files are allowed!'));
    }
    cb(null, true);
  }
});

app.post('/upload', upload.single('dbfile'), (req, res) => {
  res.status(200).send('File uploaded successfully');
}, (error, req, res, next) => {
  res.status(400).send(error.message);
});

app.get('/databases', (req, res) => {
  const uploadDir = 'uploads';
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      res.status(500).send('Failed to list databases');
      return;
    }
    const databases = files.filter(file => /\.(sqlite|db)$/i.test(file)).map(file => {
      return { name: file };
    });
    res.json(databases);
  });
});

app.get('/apps', (req, res) => {
  const dbName = req.query.db;
  if (!dbName) {
    return res.status(400).send('Database name is required');
  }
  const dbPath = path.join('uploads', `${dbName}.sqlite`);
  if (!fs.existsSync(dbPath)) {
    return res.status(404).send('Database file not found');
  }
  
  let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      res.status(500).send("Error opening database: " + err.message);
      return;
    }
  });

  db.serialize(() => {
    db.all("SELECT * FROM app", (err, rows) => {
      if (err) {
        res.status(500).send("Error reading from database: " + err.message);
        return;
      }
      res.json(rows);
    });
  });

  db.close((err) => {
    if (err) {
      console.error("Error closing database: " + err.message);
    }
  });
});

app.use(developmentPlansRouter);
app.use(developmentStepsRouter);

app.post('/submit_messages', (req, res) => {
  const { messages } = req.body;

  simulateOpenAIResponse(messages)
    .then(apiResponse => {
      res.json(apiResponse);
    })
    .catch(error => {
      console.error(error);
      res.status(503).send('Service unavailable. Could not reach the OpenAI GPT-4 API.');
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});