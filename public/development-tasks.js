import { displayDevelopmentTasks, displayFeatures } from './development-tasks-display.js';
import { clearFeaturesViews } from './shared.js';

function fetchAndDisplayDevelopmentTasks(appId, dbName) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/development_plans?app_id=${encodeURIComponent(appId)}&db=${encodeURIComponent(dbName)}`, true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      const developmentTasks = JSON.parse(xhr.responseText);
      const tasks = developmentTasks.flat();
      displayDevelopmentTasks(tasks, appId, dbName);
      clearFeaturesViews();
      fetchAndDisplayFeatures(appId, dbName);
    } else {
    }
  };
  xhr.onerror = function(e) { 
  };
  xhr.send();
}

function fetchAndDisplayFeatures(appId, dbName) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/features?app_id=${encodeURIComponent(appId)}&db=${encodeURIComponent(dbName)}`, true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      const features = JSON.parse(xhr.responseText);
      displayFeatures(features, appId, dbName); // Corrected the display function parameters
    } else {
    }
  };
  xhr.onerror = function(e) {
  };
  xhr.send();
}

export { fetchAndDisplayDevelopmentTasks };