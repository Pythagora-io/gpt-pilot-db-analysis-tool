function displayDevelopmentSteps(developmentSteps, taskIndex, appId) {
  const stepsContainer = document.createElement('div');
  stepsContainer.id = 'stepsContainer';

  developmentSteps.forEach((step) => {
    const stepItemContainer = document.createElement('div');
    stepItemContainer.classList.add('step-item');

    const promptPathElement = document.createElement('div');
    promptPathElement.textContent = `Prompt Path: ${step.prompt_path}`;
    stepItemContainer.appendChild(promptPathElement);

    if (step.messages) {
      step.messages.forEach(message => {
        const messageContentElement = document.createElement('textarea');
        messageContentElement.value = message.content;
        messageContentElement.readOnly = true;

        const messageRoleLabel = document.createElement('label');
        messageRoleLabel.textContent = `Role: ${message.role}`;

        stepItemContainer.appendChild(messageContentElement);
        stepItemContainer.appendChild(messageRoleLabel);
      });
    }

    if (step.llm_response) {
      const llmResponseTextArea = document.createElement('textarea');
      llmResponseTextArea.value = step.llm_response.text;
      llmResponseTextArea.readOnly = true;
      stepItemContainer.appendChild(llmResponseTextArea);
    }

    const promptDataContainer = document.createElement('div');
    if (step.prompt_data) {
      Object.entries(step.prompt_data).forEach(([key, value]) => {
        const keyValueElement = document.createElement('div');
        keyValueElement.textContent = `${key}: ${value}`;
        promptDataContainer.appendChild(keyValueElement);
      });
    }
    stepItemContainer.appendChild(promptDataContainer);

    stepsContainer.appendChild(stepItemContainer);
  });

  const previousStepsContainer = document.getElementById('stepsContainer');
  if (previousStepsContainer) {
    previousStepsContainer.remove();
  }
  const tasksContainer = document.getElementById('tasksContainer');
  tasksContainer.insertAdjacentElement('afterend', stepsContainer);
}

function fetchAndDisplayDevelopmentSteps(taskIndex, appId, dbName) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/development_steps?task_index=${encodeURIComponent(taskIndex)}&app_id=${encodeURIComponent(appId)}&db=${encodeURIComponent(dbName)}`, true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      const developmentSteps = JSON.parse(xhr.responseText);
      displayDevelopmentSteps(developmentSteps, taskIndex, appId);
    } else {
      alert('Failed to load development steps for the selected task');
    }
  };
  xhr.send();
}

export { fetchAndDisplayDevelopmentSteps, displayDevelopmentSteps };