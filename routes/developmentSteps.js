const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.get('/development_steps', (req, res) => {
  const taskIndex = parseInt(req.query.task_index);
  const appId = req.query.app_id;
  const dbName = req.query.db;

  if (!Number.isInteger(taskIndex) || !appId) {
    return res.status(400).send('Task index integer and app ID are required');
  }

  const dbPath = path.join('uploads', `${dbName}.sqlite`);
  if (!fs.existsSync(dbPath)) {
    return res.status(404).send('Database file not found');
  }

  let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      return res.status(500).send('Error opening database: ' + err.message);
    }
  });

  const sql = `
    SELECT * FROM development_steps
    WHERE app_id = ?
    ORDER BY id ASC
  `;

  db.all(sql, [appId], (err, rows) => {
    if (err) {
      return res.status(500).send('Error reading from database: ' + err.message);
    }

    let stepsForTask = [];
    let currentTaskIndex = -1;

    for (let i = 0; i < rows.length; i++) {
      const step = rows[i];

      if (step.prompt_path === 'development/task/breakdown.prompt') {
        currentTaskIndex++;
      }

      if (currentTaskIndex === taskIndex) {
        stepsForTask.push(step);
      }

      if (currentTaskIndex > taskIndex && stepsForTask.length > 0) {
        break;
      }
    }

    if (stepsForTask.length === 0) {
      res.status(404).send('Development steps for the given task index not found');
    } else {
      res.json(stepsForTask);
    }
  });

  db.close((err) => {
    if (err) console.error('Error closing database: ' + err.message);
  });
});

module.exports = router;