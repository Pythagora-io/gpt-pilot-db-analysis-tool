import { fetchAndDisplayDevelopmentTasks } from './development-tasks.js';

function fetchAndDisplayApps(databaseName) {
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
  let appsList = document.getElementById('appsList');
  if (appsList) {
    appsList.remove();
  }

  const appsHeading = document.createElement('h3');
  appsHeading.textContent = 'Apps';
  appsHeading.classList.add('mb-3');
  appsContainer.appendChild(appsHeading);

  appsList = document.createElement('ul');
  appsList.id = 'appsList';
  appsList.classList.add('list-group');

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