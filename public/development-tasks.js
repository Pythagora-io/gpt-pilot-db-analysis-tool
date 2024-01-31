import { displayDevelopmentTasks, displayFeatures } from './development-tasks-display.js';

function fetchAndDisplayDevelopmentTasks(appId, dbName) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/development_plans?app_id=${encodeURIComponent(appId)}&db=${encodeURIComponent(dbName)}`, true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      const developmentTasks = JSON.parse(xhr.responseText);
      const tasks = developmentTasks.flat();
      displayDevelopmentTasks(tasks, appId, dbName);
      
      // New code to fetch features once development tasks are successfully loaded
      fetch(`/features?app_id=${encodeURIComponent(appId)}&db=${encodeURIComponent(dbName)}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(features => {
          console.log('Features fetched: ', features); // gpt_pilot_debugging_log
          displayFeatures(features, dbName);
        })
        .catch(error => {
          console.error('Failed to fetch features: ', error.message, error.stack); // gpt_pilot_debugging_log
        });

    } else {
      alert('Failed to load development tasks for the selected app');
    }
  };
  xhr.onerror = function(e) {
    console.error('Network error occurred when trying to fetch development tasks: ', e); // gpt_pilot_debugging_log
  };
  xhr.send();
}

export { fetchAndDisplayDevelopmentTasks };