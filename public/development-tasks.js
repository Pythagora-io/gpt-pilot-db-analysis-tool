import { displayDevelopmentTasks } from './development-tasks-display.js';

function fetchAndDisplayDevelopmentTasks(appId, dbName) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/development_plans?app_id=${encodeURIComponent(appId)}&db=${encodeURIComponent(dbName)}`, true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      const developmentTasks = JSON.parse(xhr.responseText);
      const tasks = developmentTasks.flat();
      displayDevelopmentTasks(tasks, appId, dbName);
    } else {
      alert('Failed to load development tasks for the selected app');
    }
  };
  xhr.send();
}

export { fetchAndDisplayDevelopmentTasks };