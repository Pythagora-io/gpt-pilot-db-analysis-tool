import { fetchAndDisplayDevelopmentTasks } from './development-tasks.js';

function removeElementById(elementId) {
  const existingElement = document.getElementById(elementId);
  if (existingElement) {
    existingElement.remove();
  }
}

function fetchAndDisplayApps(databaseName) {
  removeElementById('stepsContainer');
  removeElementById('tasksContainer');
  removeElementById('tasksHeading');
  removeElementById('stepsHeading');
  removeElementById('appsList');

  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/apps?db=' + encodeURIComponent(databaseName), true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      const apps = JSON.parse(xhr.responseText);
      displayApps(apps, databaseName); // Pass the databaseName to the displayApps function
    } else {
      alert('Failed to load apps from the selected database');
    }
  };
  xhr.send();
}

function displayApps(apps, databaseName) {
  const appsContainer = document.getElementById('appsContainer');

  // Remove any existing details related to development steps or tasks
  removeElementById('stepsHeading');
  removeElementById('tasksContainer');
  removeElementById('tasksHeading');

  // Remove previous apps list if exist
  removeElementById('appsList');

  // Create a new apps heading
  let appsHeading = document.getElementById('appsHeading');
  if (!appsHeading) {
    appsHeading = document.createElement('h3');
    appsHeading.id = 'appsHeading';
    appsHeading.textContent = 'Apps';
    appsHeading.classList.add('mb-3');
    appsContainer.appendChild(appsHeading);
  }

  // Create a new apps list
  const appsList = document.createElement('ul');
  appsList.id = 'appsList';
  appsList.classList.add('list-group');

  // Populate apps list with apps
  apps.forEach(function(app) {
    const appItem = document.createElement('li');
    appItem.textContent = app.name;
    appItem.id = 'app_' + app.id;
    appItem.classList.add('list-group-item', 'app-item');
    appItem.dataset.appId = app.id;
    appItem.addEventListener('click', function() {
      fetchAndDisplayDevelopmentTasks(app.id, databaseName);
    });
    appsList.appendChild(appItem);
  });
  appsContainer.appendChild(appsList);
}

export { fetchAndDisplayApps, fetchAndDisplayDevelopmentTasks };