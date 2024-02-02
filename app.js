require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const developmentPlansRouter = require('./routes/developmentPlans');
const developmentStepsRouter = require('./routes/developmentSteps');
const featuresDevelopmentStepsRouter = require('./routes/featuresDevelopmentSteps');
const featuresDevelopmentPlansRouter = require('./routes/featuresDevelopmentPlans'); // Added new router for features with development plans
const { handleOpenAIMessage } = require('./handlers/openaiMessageHandler');
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
  console.log('Database upload requested.'); 
  res.status(200).send('File uploaded successfully');
}, (error, req, res, next) => {
  console.error('Error during file upload: ', error.stack || error); 
  res.status(400).send(error.message);
});

app.get('/databases', (req, res) => {
  const uploadDir = 'uploads';
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error('Error listing database files: ', err.stack || err); 
      res.status(500).send('Failed to list databases');
      return;
    }
    const databases = files.filter(file => /\.(sqlite|db)$/i.test(file)).map(file => {
      return { name: file };
    });
    console.log('Database list retrieved successfully.');
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
      console.error('Error opening database: ', err.stack || err); 
      res.status(500).send('Error opening database: ' + err.message);
      return;
    }
  });

  db.serialize(() => {
    db.all("SELECT * FROM app", (err, rows) => {
      if (err) {
        console.error('Error reading app data from database: ', err.stack || err); 
        res.status(500).send('Error reading from database: ' + err.message);
        return;
      }
      console.log('Apps list retrieved successfully.'); 
      res.json(rows);
    });
  });

  db.close((err) => {
    if (err) {
      console.error('Error closing database: ', err.stack || err); 
    }
  });
});

app.use(developmentPlansRouter);
app.use(developmentStepsRouter);
app.use(featuresDevelopmentStepsRouter);
app.use(featuresDevelopmentPlansRouter); // Using new router

app.post('/submit_messages', handleOpenAIMessage);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});