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
        const errorMessage = `Error reading from database for app_id ${appId}: ${err.message}`;
        reject(new Error(errorMessage));
        return;
      }

      const features = rows.map(row => {
        let feature_description;
        let development_tasks = [];
        try {
          const parsedPromptData = JSON.parse(row.prompt_data);
          feature_description = parsedPromptData.feature_description;
          try {
            const parsedLlmResponse = JSON.parse(row.llm_response);
            development_tasks = parsedLlmResponse && parsedLlmResponse.text ? JSON.parse(parsedLlmResponse.text).plan : [];
          } catch (innerParseError) {
          }
        } catch (parseError) {
          reject(parseError);
          return;
        }
        return {
          description: feature_description,
          development_tasks
        };
      });

      resolve(features);
    });
  });
}

module.exports = {
  getFeaturesByAppId
};