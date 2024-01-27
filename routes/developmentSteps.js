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

    function groupStepsByTask(steps) {
      const groupedSteps = [];
      let currentGroup = [];
      steps.forEach(step => {
        if (step.prompt_path === 'development/task/breakdown.prompt') {
          if (currentGroup.length > 0) {
            groupedSteps.push(currentGroup);
          }
          currentGroup = [step];
        } else {
          currentGroup.push(step);
        }
      });

      if (currentGroup.length > 0) {
        groupedSteps.push(currentGroup);
      }
      return groupedSteps;
    }

    const groupedSteps = groupStepsByTask(rows);
    if (taskIndex < 0 || taskIndex >= groupedSteps.length) {
      return res.status(404).send('Development task index out of bounds');
    }

    res.json(groupedSteps[taskIndex]);
  });

  db.close((err) => {
    if (err) console.error('Error closing database: ' + err.message);
  });
});

router.get('/development_step', (req, res) => {
  const stepId = req.query.id;
  const dbName = req.query.db;

  if (!stepId || !dbName) {
    return res.status(400).send('Step ID and database name are required');
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

  const sql = 'SELECT prompt_path, messages, llm_response, prompt_data FROM development_steps WHERE id = ?';

  db.get(sql, [stepId], (err, row) => {
    if (err) {
      return res.status(500).send('Error reading from database: ' + err.message);
    }
    if (row) {
      row.messages = typeof row.messages === 'string' ? JSON.parse(row.messages) : row.messages;
      row.llm_response = typeof row.llm_response === 'string' ? JSON.parse(row.llm_response) : row.llm_response;
      row.prompt_data = typeof row.prompt_data === 'string' ? JSON.parse(row.prompt_data) : row.prompt_data;
      res.json(row);
    } else {
      res.status(404).send('Development step not found');
    }
  });

  db.close((err) => {
    if (err) console.error('Error closing database: ' + err.message);
  });
});

module.exports = router;