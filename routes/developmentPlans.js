const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.get('/development_plans', (req, res) => {
  const appId = req.query.app_id;
  if (!appId) {
    return res.status(400).send('App ID is required');
  }

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
      res.status(500).send('Error opening database: ' + err.message);
      return;
    }
  });

  const sql = 'SELECT development_plan FROM development_planning WHERE app_id = ?';

  db.all(sql, [appId], (err, rows) => {
    if (err) {
      res.status(500).send('Error reading from database: ' + err.message);
      return;
    }

    const plans = rows.map(row => JSON.parse(row.development_plan));
    res.json(plans);
  });

  db.close((err) => {
    if (err) {
      console.error('Error closing database: ' + err.message);
    }
  });
});

module.exports = router;