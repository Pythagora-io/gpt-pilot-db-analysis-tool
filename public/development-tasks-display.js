import { fetchAndDisplayDevelopmentSteps } from './development-steps.js';
import { highlightSelectedItem } from './shared.js';

export function displayDevelopmentTasks(developmentTasks, appId, dbName) {
  const tasksContainer = document.getElementById('tasksContainer') || document.createElement('ul');
  tasksContainer.id = 'tasksContainer';
  tasksContainer.classList.add('list-group', 'mt-3');
  tasksContainer.innerHTML = '';

  let tasksHeading = document.getElementById('tasksHeading');
  if (!tasksHeading) {
    tasksHeading = document.createElement('h3');
    tasksHeading.id = 'tasksHeading';
    tasksHeading.classList.add('mb-3');
    tasksHeading.textContent = 'Development Tasks';
    tasksContainer.before(tasksHeading);
  }

  developmentTasks.forEach((task, index) => {
    const taskItem = document.createElement('li');
    taskItem.textContent = task.description;
    taskItem.classList.add('list-group-item', 'task-item');
    taskItem.dataset.taskIndex = index;
    taskItem.addEventListener('click', function() {
      highlightSelectedItem.call(taskItem, '.task-item', 'active');
      fetchAndDisplayDevelopmentSteps(index, appId, dbName);
    });
    tasksContainer.appendChild(taskItem);
  });

  const appsContainer = document.getElementById('appsContainer');
  const previousTasksContainer = appsContainer.querySelector('#tasksContainer');
  if (previousTasksContainer) {
    appsContainer.replaceChild(tasksContainer, previousTasksContainer);
  } else {
    appsContainer.appendChild(tasksHeading);
    appsContainer.appendChild(tasksContainer);
  }
}

export function displayNoDevelopmentStepsMessage() {
  let stepsContainer = document.getElementById('stepsContainer');
  if (!stepsContainer) {
    stepsContainer = document.createElement('div');
    stepsContainer.id = 'stepsContainer';
    stepsContainer.classList.add('mt-3');
  
    const heading = document.createElement('h3');
    heading.textContent = 'Development Steps';
    stepsContainer.appendChild(heading);

    const appsContainer = document.getElementById('appsContainer');
    appsContainer.appendChild(stepsContainer);
  }

  stepsContainer.innerHTML = '';
  
  const heading = document.createElement('h3');
  heading.textContent = 'Development Steps';
  stepsContainer.appendChild(heading);

  const noStepsMessage = document.createElement('p');
  noStepsMessage.textContent = 'No development steps found for this task.';
  stepsContainer.appendChild(noStepsMessage);
}