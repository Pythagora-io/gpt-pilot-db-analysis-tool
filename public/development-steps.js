function displayDevelopmentSteps(developmentSteps, taskIndex, appId, dbName) {
  const stepsContainer = document.createElement('div');
  stepsContainer.id = 'stepsContainer';
  stepsContainer.classList.add('mt-3');

  const heading = document.createElement('h3');
  heading.classList.add('mb-3');
  heading.textContent = 'Development Steps';
  stepsContainer.appendChild(heading);

  developmentSteps.forEach((step) => {
    const stepItemContainer = document.createElement('div');
    stepItemContainer.classList.add('card', 'mb-3');
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    stepItemContainer.appendChild(cardBody);

    const promptPathButton = document.createElement('button');
    promptPathButton.classList.add('btn', 'btn-link');
    promptPathButton.setAttribute('type', 'button');
    promptPathButton.setAttribute('data-toggle', 'collapse');
    promptPathButton.setAttribute('data-target', `#collapseStep${step.id}`);
    promptPathButton.setAttribute('aria-expanded', 'false');
    promptPathButton.setAttribute('aria-controls', `collapseStep${step.id}`);
    promptPathButton.textContent = step.prompt_path;
    promptPathButton.classList.add('card-title');
    cardBody.appendChild(promptPathButton);
    
    const collapseDiv = document.createElement('div');
    collapseDiv.id = `collapseStep${step.id}`;
    collapseDiv.classList.add('collapse');
    
    // Parse messages if it is a string
    const messages = typeof step.messages === 'string' ? JSON.parse(step.messages) : step.messages;
    if (messages) {
      const messagesContainer = document.createElement('div');
      messagesContainer.classList.add('mb-2');
      messages.forEach(message => {
        const messageContentElement = document.createElement('textarea');
        messageContentElement.value = message.content;
        messageContentElement.classList.add('form-control', 'mb-1');
    
        const messageRoleLabel = document.createElement('h6');
        messageRoleLabel.textContent = `Role: ${message.role}`;
        messageRoleLabel.classList.add('mb-1');
    
        messagesContainer.appendChild(messageRoleLabel);
        messagesContainer.appendChild(messageContentElement);
      });
      collapseDiv.appendChild(messagesContainer);
    }
    
    // Parse llm_response if it is a string
    const llmResponse = typeof step.llm_response === 'string' ? JSON.parse(step.llm_response) : step.llm_response;
    if (llmResponse) {
      const llmResponseTextTitle = document.createElement('h6');
      llmResponseTextTitle.textContent = 'LLM Response:';
      llmResponseTextTitle.classList.add('mb-1');
      const llmResponseTextArea = document.createElement('textarea');
      llmResponseTextArea.value = llmResponse.text;
      llmResponseTextArea.classList.add('form-control');
      collapseDiv.appendChild(llmResponseTextTitle);
      collapseDiv.appendChild(llmResponseTextArea);
    }

    // Parse prompt_data if it is a string and add to collapsible div
    const promptData = typeof step.prompt_data === 'string' ? JSON.parse(step.prompt_data) : step.prompt_data;
    if (promptData) {
      const promptDataContainer = document.createElement('div');
      promptDataContainer.classList.add('mb-2');
      Object.entries(promptData).forEach(([key, value]) => {
        const keyValueElement = document.createElement('p');
        keyValueElement.textContent = `${key}: ${value}`;
        keyValueElement.classList.add('card-text');
        promptDataContainer.appendChild(keyValueElement);
      });
      collapseDiv.appendChild(promptDataContainer);
    }
    
    cardBody.appendChild(collapseDiv);
    stepsContainer.appendChild(stepItemContainer);
  });

  const appsContainer = document.getElementById('appsContainer');
  const previousStepsContainer = document.getElementById('stepsContainer');
  if (previousStepsContainer) {
    appsContainer.replaceChild(stepsContainer, previousStepsContainer);
  } else {
    appsContainer.appendChild(stepsContainer);
  }
}

function fetchAndDisplayDevelopmentStepDetails(stepId, dbName) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/development_step?id=${encodeURIComponent(stepId)}&db=${encodeURIComponent(dbName)}`, true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      const stepDetails = JSON.parse(xhr.responseText);
      displayDevelopmentStepDetails(stepDetails);
    } else {
      console.error('Failed to load development step details');
    }
  };
  xhr.onerror = function() {
    console.error('An error occurred during the Ajax request.');
  };
  xhr.send();
}

function displayDevelopmentStepDetails(stepDetails) {
  const stepDetailsContainer = document.createElement('div');
  stepDetailsContainer.id = 'stepDetailsContainer';
  stepDetailsContainer.classList.add('mt-3');

  // Display messages
  const messagesHeading = document.createElement('h4');
  messagesHeading.textContent = 'Messages';
  stepDetailsContainer.appendChild(messagesHeading);

  stepDetails.messages.forEach(message => {
    const messageRoleElement = document.createElement('h5');
    messageRoleElement.textContent = `Role: ${message.role}`;
    stepDetailsContainer.appendChild(messageRoleElement);

    const messageContentElement = document.createElement('textarea');
    messageContentElement.value = message.content;
    messageContentElement.classList.add('form-control', 'mb-2');
    stepDetailsContainer.appendChild(messageContentElement);
  });

  // Display llm_response
  const llmResponseHeading = document.createElement('h4');
  llmResponseHeading.textContent = 'LLM Response';
  stepDetailsContainer.appendChild(llmResponseHeading);

  const llmResponseElement = document.createElement('textarea');
  llmResponseElement.value = stepDetails.llm_response.text;
  llmResponseElement.classList.add('form-control', 'mb-2');
  stepDetailsContainer.appendChild(llmResponseElement);

  // Display prompt_data
  const promptDataHeading = document.createElement('h4');
  promptDataHeading.textContent = 'Prompt Data';
  stepDetailsContainer.appendChild(promptDataHeading);
  
  Object.entries(stepDetails.prompt_data).forEach(([key, value]) => {
    const dataElement = document.createElement('p');
    dataElement.textContent = `${key}: ${value}`;
    stepDetailsContainer.appendChild(dataElement);
  });

  // Replace existing stepDetailsContainer if present, otherwise append
  const appsContainer = document.getElementById('appsContainer');
  const previousStepDetailsContainer = document.getElementById('stepDetailsContainer');
  if (previousStepDetailsContainer) {
    appsContainer.replaceChild(stepDetailsContainer, previousStepDetailsContainer);
  } else {
    appsContainer.appendChild(stepDetailsContainer);
  }
}

function fetchAndDisplayDevelopmentSteps(taskIndex, appId, dbName) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/development_steps?task_index=${encodeURIComponent(taskIndex)}&app_id=${encodeURIComponent(appId)}&db=${encodeURIComponent(dbName)}`, true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      // Check if the response array is empty or contains the specific 'out of bounds' message
      if (response.length === 0 || (typeof response === 'string' && response.includes('Development task index out of bounds'))) {
        displayNoDevelopmentStepsMessage();
      } else {
        displayDevelopmentSteps(response, taskIndex, appId, dbName);
      }
    } else {
      console.error('Failed to load development steps for the selected task');
      displayNoDevelopmentStepsMessage(); // We invoke the message display for any non-200 status as well.
    }
  };
  xhr.onerror = function() {
    console.error('An error occurred during the Ajax request.');
    displayNoDevelopmentStepsMessage(); // Display message on request error as well.
  };
  xhr.send();
}

function displayNoDevelopmentStepsMessage() {
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

export { fetchAndDisplayDevelopmentSteps, displayDevelopmentSteps };