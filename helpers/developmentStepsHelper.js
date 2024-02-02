const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

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

async function fetchAndGroupDevelopmentSteps(appId, dbName) {
  const dbPath = path.join('uploads', `${dbName}.sqlite`);
  if (!fs.existsSync(dbPath)) {
    throw new Error('Database file not found');
  }

  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM development_steps
      WHERE app_id = ?
      ORDER BY id ASC
    `;
    db.all(sql, [appId], (err, rows) => {
      db.close();
      if (err) {
        reject(new Error(`Error reading from database: ${err.message}`));
        return;
      }
      resolve(groupStepsByTask(rows));
    });
  });
}

module.exports = {
  fetchAndGroupDevelopmentSteps
};