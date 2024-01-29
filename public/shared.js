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

function clearActiveFromElements(elements) {
  elements.forEach(element => element.classList.remove('active'));
}

function fetchAndDisplayApps(databaseName) {
  clearDevelopmentViews();
  removeElementById('appsList');

  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/apps?db=' + encodeURIComponent(databaseName), true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      const apps = JSON.parse(xhr.responseText);
      displayApps(apps, databaseName);
    } else {
      alert('Failed to load apps from the selected database');
    }
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
      appItem.classList.add('active');
      fetchAndDisplayDevelopmentTasks(app.id, databaseName);
    });
    appsList.appendChild(appItem);
  });
  appsContainer.appendChild(appsList);
}

export function highlightSelectedItem(itemSelector, activeClass) {
  const elements = document.querySelectorAll(itemSelector);
  clearActiveFromElements(elements);
  this.classList.add(activeClass);
}

export { fetchAndDisplayApps, fetchAndDisplayDevelopmentTasks };