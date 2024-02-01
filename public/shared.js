import { fetchAndDisplayDevelopmentTasks } from './development-tasks.js';

function removeElementById(elementId) {
  const existingElement = document.getElementById(elementId);
  if (existingElement) {
    existingElement.remove();
  }
}

function clearDevelopmentViews() {
  removeElementById('tasksContainer');
  removeElementById('tasksHeading');
  removeElementById('stepsContainer');
  removeElementById('stepsHeading');
}

// New function to clear the features view
function clearFeaturesViews() {
  removeElementById('featuresHeading'); // Remove the features heading element
  removeElementById('featuresList'); // Remove the features list element
}

// Updated to clear features views as well
function fetchAndDisplayApps(databaseName) {
  clearDevelopmentViews();
  clearFeaturesViews(); // Call the new function to clear features views
  removeElementById('appsList');

  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/apps?db=' + encodeURIComponent(databaseName), true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      const apps = JSON.parse(xhr.responseText);
      displayApps(apps, databaseName);
    } else {
      console.error('Failed to load apps from the selected database:', xhr.responseText); // Error handling for failed app loading
      alert('Failed to load apps from the selected database');
    }
  };
  xhr.onerror = function(e) {
    console.error('Network error occurred when trying to fetch apps:', e); // Error handling for network error
  };
  xhr.send();
}

function displayApps(apps, databaseName) {
  const appsContainer = document.getElementById('appsContainer');

  let appsHeading = document.getElementById('appsHeading');
  if (!appsHeading) {
    appsHeading = document.createElement('h3');
    appsHeading.id = 'appsHeading';
    appsHeading.textContent = 'Apps';
    appsHeading.classList.add('mb-3');
    appsContainer.appendChild(appsHeading);
  }

  const appsList = document.createElement('ul');
  appsList.id = 'appsList';
  appsList.classList.add('list-group');

  apps.forEach(function(app) {
    const appItem = document.createElement('li');
    appItem.textContent = app.name;
    appItem.id = 'app_' + app.id;
    appItem.classList.add('list-group-item', 'app-item');
    appItem.dataset.appId = app.id;
    appItem.addEventListener('click', function() {
      clearActiveFromElements(Array.from(document.getElementsByClassName('app-item')));
      clearDevelopmentViews();
      clearFeaturesViews(); // Clear features views when an app item is clicked
      appItem.classList.add('active');
      fetchAndDisplayDevelopmentTasks(app.id, databaseName);
    });
    appsList.appendChild(appItem);
  });
  appsContainer.appendChild(appsList);
}

function clearActiveFromElements(elements) {
  elements.forEach(element => element.classList.remove('active'));
}

function highlightSelectedItem(itemSelector, activeClass) {
  const elements = document.querySelectorAll(itemSelector);
  clearActiveFromElements(elements);
  this.classList.add(activeClass);
}

export { fetchAndDisplayApps, fetchAndDisplayDevelopmentTasks, clearDevelopmentViews, clearFeaturesViews, highlightSelectedItem };