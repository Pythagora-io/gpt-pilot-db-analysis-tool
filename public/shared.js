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
  const appsList = document.createElement('div');
  appsList.id = 'appsList';
  apps.forEach(function(app) {
    const appItem = document.createElement('div');
    appItem.textContent = app.name;
    appItem.id = 'app_' + app.id;
    appItem.classList.add('app-item'); // Add a class for CSS styling
    appItem.dataset.appId = app.id; // Store app ID

    // Add event listener to each app item to fetch and display development tasks
    appItem.addEventListener('click', function() {
      fetchAndDisplayDevelopmentTasks(app.id, databaseName); // Fetch and display tasks when app item is clicked
    });

    appsList.appendChild(appItem);
  });
  const previousAppsList = document.getElementById('appsList');
  if (previousAppsList) {
    previousAppsList.remove();
  }
  const existingDbsElement = document.getElementById('existingDbs');
  existingDbsElement.insertAdjacentElement('afterend', appsList);
}

// Assume fetchAndDisplayDevelopmentTasks is defined in another module and imported here
import { fetchAndDisplayDevelopmentTasks } from './development-tasks.js';

export { fetchAndDisplayApps, fetchAndDisplayDevelopmentTasks };