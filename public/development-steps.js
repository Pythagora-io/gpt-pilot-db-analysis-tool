function displayDevelopmentSteps(developmentSteps, taskIndex, appId) {
  console.log(`Adding stepsContainer to the DOM with ${developmentSteps.length} steps.`);
  const stepsContainer = document.createElement('div');
  stepsContainer.id = 'stepsContainer';

  developmentSteps.forEach((step) => {
    const stepItemContainer = document.createElement('div');
    stepItemContainer.classList.add('step-item');

    const promptPathElement = document.createElement('div');
    promptPathElement.textContent = `Prompt Path: ${step.prompt_path}`;
    stepItemContainer.appendChild(promptPathElement);

    // Parse messages if it is a string
    const messages = typeof step.messages === 'string' ? JSON.parse(step.messages) : step.messages;
    if (messages) {
      messages.forEach(message => {
        const messageContentElement = document.createElement('textarea');
        messageContentElement.value = message.content;
        messageContentElement.readOnly = true;

        const messageRoleLabel = document.createElement('label');
        messageRoleLabel.textContent = `Role: ${message.role}`;

        stepItemContainer.appendChild(messageContentElement);
        stepItemContainer.appendChild(messageRoleLabel);
      });
    }

    // Parse llm_response if it is a string
    const llmResponse = typeof step.llm_response === 'string' ? JSON.parse(step.llm_response) : step.llm_response;
    if (llmResponse) {
      const llmResponseTextArea = document.createElement('textarea');
      llmResponseTextArea.value = llmResponse.text;
      llmResponseTextArea.readOnly = true;
      stepItemContainer.appendChild(llmResponseTextArea);
    }

    // Parse prompt_data if it is a string
    const promptDataContainer = document.createElement('div');
    const promptData = typeof step.prompt_data === 'string' ? JSON.parse(step.prompt_data) : step.prompt_data;
    if (promptData) {
      Object.entries(promptData).forEach(([key, value]) => {
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
  if (tasksContainer) {
    tasksContainer.insertAdjacentElement('afterend', stepsContainer);
  } else {
    console.error('Failed to find tasksContainer for inserting the steps.');
  }
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
  xhr.onerror = function() {
    console.error('An error occurred during the Ajax request.');
  };
  xhr.send();
}

export { fetchAndDisplayDevelopmentSteps, displayDevelopmentSteps };