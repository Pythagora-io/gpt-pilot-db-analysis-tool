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

// Function to display features
export function displayFeatures(features, dbName) {
  try {
    const appsContainer = document.getElementById('appsContainer');

    let featuresHeading = document.getElementById('featuresHeading');
    if (!featuresHeading) {
      featuresHeading = document.createElement('h3');
      featuresHeading.id = 'featuresHeading';
      featuresHeading.textContent = 'Features';
      featuresHeading.classList.add('my-3');
      appsContainer.appendChild(featuresHeading);
    }

    const featuresList = document.createElement('div');
    featuresList.id = 'featuresList';
    featuresList.classList.add('features-list');

    features.forEach((feature, index) => {
      const featureContainer = document.createElement('div');
      featureContainer.classList.add('card', 'feature-container', 'mb-3');

      const featureHeader = document.createElement('div');
      featureHeader.classList.add('card-header', 'feature-header');
      featureHeader.textContent = feature.description;

      const collapseButton = document.createElement('button');
      collapseButton.textContent = 'Show Development Tasks';
      collapseButton.classList.add('btn', 'btn-link');
      collapseButton.setAttribute('data-toggle', 'collapse');
      collapseButton.setAttribute('data-target', `#collapseFeature${index}`);
      collapseButton.setAttribute('aria-expanded', 'false');
      collapseButton.setAttribute('aria-controls', `collapseFeature${index}`);
      featureHeader.appendChild(collapseButton);

      const collapseContent = document.createElement('div');
      collapseContent.id = `collapseFeature${index}`;
      collapseContent.classList.add('collapse', 'feature-collapse');

      const developmentTasksPlaceholder = document.createElement('div');
      developmentTasksPlaceholder.classList.add('development-tasks-placeholder');
      developmentTasksPlaceholder.textContent = 'Development tasks will be listed here...';
      collapseContent.appendChild(developmentTasksPlaceholder);

      featureContainer.appendChild(featureHeader);
      featureContainer.appendChild(collapseContent);
      featuresList.appendChild(featureContainer);

      console.log(`Setting up feature collapse for ID #collapseFeature${index}`, feature); // gpt_pilot_debugging_log
    });

    appsContainer.appendChild(featuresList);
    console.log('Features have been rendered.'); // gpt_pilot_debugging_log
  } catch (error) {
    console.error('Error displaying features:', error.stack || error); // gpt_pilot_debugging_log
    alert('Failed to display features. Please check the console for more details.');
  }
}