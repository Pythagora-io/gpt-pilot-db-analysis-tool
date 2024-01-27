import { fetchAndDisplayDevelopmentSteps } from './development-steps.js';

function displayDevelopmentTasks(developmentTasks, appId, dbName) {
  let tasksContainer = document.getElementById('tasksContainer');
  if (!tasksContainer) {
    tasksContainer = document.createElement('ul');
    tasksContainer.id = 'tasksContainer';
    tasksContainer.classList.add('list-group', 'mt-3');
  } else {
    tasksContainer.innerHTML = ''; // Clear the existing tasks if any
  }
  
  // Create and insert the 'Development Tasks' heading
  const tasksHeading = document.createElement('h3');
  tasksHeading.classList.add('mb-3');
  tasksHeading.textContent = 'Development Tasks';
  tasksContainer.before(tasksHeading); // Insert before the tasks list

  developmentTasks.forEach((task, index) => {
    const taskItem = document.createElement('li');
    taskItem.textContent = task.description;
    taskItem.classList.add('list-group-item', 'task-item');
    taskItem.dataset.taskIndex = index;
    taskItem.addEventListener('click', function() {
      fetchAndDisplayDevelopmentSteps(index, appId, dbName);
    });
    tasksContainer.appendChild(taskItem);
  });

  const appsContainer = document.getElementById('appsContainer');
  if (appsContainer) {
    const previousTasksContainer = appsContainer.querySelector('#tasksContainer');
    if (previousTasksContainer) {
      // Insert the heading before the tasksContainer which replaces the previous container
      appsContainer.insertBefore(tasksHeading, previousTasksContainer);
      appsContainer.replaceChild(tasksContainer, previousTasksContainer);
    } else {
      appsContainer.appendChild(tasksHeading);
      appsContainer.appendChild(tasksContainer);
    }
  } else {
    console.error('The appsContainer element was not found in the DOM.');
  }
}

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