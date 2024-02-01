import { displayDevelopmentTasks, displayFeatures } from './development-tasks-display.js';
import { clearFeaturesViews } from './shared.js';

function fetchAndDisplayDevelopmentTasks(appId, dbName) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/development_plans?app_id=${encodeURIComponent(appId)}&db=${encodeURIComponent(dbName)}`, true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      console.log('Development tasks successfully fetched for app ID:', appId);
      const developmentTasks = JSON.parse(xhr.responseText);
      const tasks = developmentTasks.flat();
      displayDevelopmentTasks(tasks, appId, dbName);
      clearFeaturesViews();
      fetchAndDisplayFeatures(appId, dbName);
    } else {
      console.error('Failed to load development tasks for selected app. Status Code:', xhr.status, 'Response:', xhr.responseText);
    }
  };
  xhr.onerror = function(e) { 
    console.error('Network error while trying to fetch development tasks:', e.message, e.stack);
  };
  xhr.send();
}

function fetchAndDisplayFeatures(appId, dbName) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/features?app_id=${encodeURIComponent(appId)}&db=${encodeURIComponent(dbName)}`, true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      console.log('Features successfully fetched for app ID:', appId);
      const features = JSON.parse(xhr.responseText);
      displayFeatures(features, dbName);
    } else {
      console.error('Failed to load features for the selected app. Status Code:', xhr.status, 'Response:', xhr.responseText);
    }
  };
  xhr.onerror = function(e) {
    console.error('Network error occurred when trying to fetch features:', e.message, e.stack);
  };
  xhr.send();
}

export { fetchAndDisplayDevelopmentTasks };