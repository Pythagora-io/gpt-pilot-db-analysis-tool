const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

async function getFeaturesByAppId(appId, dbName) {
  const dbPath = path.join('uploads', `${dbName}.sqlite`);
  if (!fs.existsSync(dbPath)) {
    throw new Error('Database file not found');
  }
  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);
  return new Promise((resolve, reject) => {
    const sql = `SELECT prompt_data, llm_response FROM development_steps WHERE app_id = ? AND prompt_path = 'development/feature_plan.prompt'`;
    db.all(sql, [appId], (err, rows) => {
      db.close();
      if (err) {
        reject(new Error('Error reading from database: ' + err.message));
        return;
      }
      const features = rows.map(row => {
        let feature_description;
        let development_tasks;
        try {
          feature_description = JSON.parse(row.prompt_data).feature_description;
        } catch(parseError) {
          reject(new Error('Error parsing prompt_data: ' + parseError.message));
          return;
        }
        try {
          const llmData = JSON.parse(row.llm_response);
          development_tasks = llmData.plan;
        } catch(parseError) {
          reject(new Error('Error parsing llm_response: ' + parseError.message));
          return;
        }
        return {
          description: feature_description,
          development_tasks: development_tasks
        };
      });
      resolve(features);
    });
  });
}

module.exports = {
  getFeaturesByAppId
};