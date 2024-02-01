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
        console.error(errorMessage); // gpt_pilot_debugging_log
        reject(new Error(errorMessage));
        return;
      }

      console.log('Fetched rows for features:', rows); // gpt_pilot_debugging_log

      const features = rows.map(row => {
        let feature_description;
        let development_tasks;
        try {
          const parsedPromptData = JSON.parse(row.prompt_data);
          feature_description = parsedPromptData.feature_description;
          console.log('Feature description for app_id ' + appId + ':', feature_description); // gpt_pilot_debugging_log
        } catch(parseError) {
          console.error(`Error parsing prompt_data for app_id ${appId}:`, parseError.message, parseError.stack); // gpt_pilot_debugging_log
          reject(new Error(`Error parsing prompt_data for app_id ${appId}: ${parseError.message}`));
          return;
        }
        try {
          const parsedLlmResponse = JSON.parse(row.llm_response);
          console.log('llm_response.text content:', parsedLlmResponse.text); // gpt_pilot_debugging_log
          if (typeof parsedLlmResponse.text === 'string' && parsedLlmResponse.text) {
            development_tasks = JSON.parse(parsedLlmResponse.text).plan;
            console.log('Parsed development tasks:', development_tasks); // gpt_pilot_debugging_log
          } else {
            development_tasks = []; // In case 'text' is not a string or empty string
            console.warn('llm_response.text is empty or not a string:', parsedLlmResponse.text); // gpt_pilot_debugging_log
          }
        } catch(parseError) {
          console.error(`Error parsing 'plan' within llm_response.text for app_id ${appId}, content was:`, row.llm_response, 'Error:', parseError.message, parseError.stack); // gpt_pilot_debugging_log
          reject(new Error(`Error parsing 'plan' within llm_response.text for app_id ${appId}: ${parseError.message}`));
          return;
        }
        return {
          description: feature_description,
          development_tasks: development_tasks || [] // Ensure development_tasks is an array even if parsing fails
        };
      });

      resolve(features);
    });
  });
}

module.exports = {
  getFeaturesByAppId
};