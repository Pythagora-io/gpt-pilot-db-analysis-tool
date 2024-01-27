import { fetchAndDisplayDevelopmentSteps } from './development-steps.js';

function displayDevelopmentTasks(developmentTasks, appId, dbName) {
  const tasksContainer = document.createElement('div');
  tasksContainer.id = 'tasksContainer';
  developmentTasks.forEach((task, index) => {
    const taskItem = document.createElement('div');
    taskItem.textContent = task.description;
    taskItem.classList.add('task-item');
    taskItem.dataset.taskIndex = index;
    taskItem.addEventListener('click', function() {
      fetchAndDisplayDevelopmentSteps(index, appId, dbName);
    });
    tasksContainer.appendChild(taskItem);
  });
  const previousTasksContainer = document.getElementById('tasksContainer');
  if (previousTasksContainer) {
    previousTasksContainer.remove();
  }
  const appsList = document.getElementById('appsList');
  appsList.insertAdjacentElement('afterend', tasksContainer);
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
