import { insertAfter } from './utils.js';

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
      messages.forEach((message, index) => {
        const messageContentElement = document.createElement('textarea');
        messageContentElement.value = message.content;
        messageContentElement.classList.add('form-control', 'mb-1', 'message-content');
        messageContentElement.setAttribute('data-index', index);
        messageContentElement.setAttribute('data-role', message.role || 'user'); // Set 'user' as default role if missing

        const messageRoleLabel = document.createElement('h6');
        messageRoleLabel.textContent = `Role: ${message.role}`;
        messageRoleLabel.classList.add('mb-1');

        messagesContainer.appendChild(messageRoleLabel);
        messagesContainer.appendChild(messageContentElement);
      });

      const submitButton = createSubmitButton(step.id);
      messagesContainer.appendChild(submitButton);
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

function createSubmitButton(stepId) {
  const submitButton = document.createElement('button');
  submitButton.textContent = 'Submit';
  submitButton.classList.add('btn', 'btn-primary', 'mt-2');
  submitButton.setAttribute('data-step-id', stepId.toString());
  submitButton.addEventListener('click', () => {
    try {
      const messageContents = Array.from(document.querySelectorAll(`#collapseStep${stepId} .message-content`)).map(textarea => {
        const role = textarea.getAttribute('data-role');
        
        if (!role) {
          throw new Error(`Missing role for message with content: ${textarea.value}`);
        }
  
        return {
          content: textarea.value,
          role: role
        };
      });
      submitMessages(stepId, messageContents);
    } catch (error) {
      console.error('Error preparing messages for submission:', error);
      alert('Error: One or more messages are missing a role. Please refresh the page and try again.');
    }
  });
  return submitButton;
}

function submitMessages(stepId, messages) {
  const data = { messages };
  const submitButton = document.querySelector(`button[data-step-id="${stepId}"]`);
  const spinner = showSpinner(stepId, true);
  submitButton.disabled = true;
  submitButton.after(spinner);

  fetch(`/submit_messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  .then(response => {
    showSpinner(stepId, false);
    submitButton.disabled = false;
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(responseData => {
    if (responseData.error) {
      throw new Error(responseData.error.message);
    }
    displayOpenAIResponse(stepId, responseData);
  })
  .catch(error => {
    showSpinner(stepId, false);
    submitButton.disabled = false;
    displayApiError(error, stepId);
  });
}

function showSpinner(stepId, shouldShow) {
  let spinner = document.querySelector(`#spinner-${stepId}`);
  
  if (shouldShow) {
    if (!spinner) {
      spinner = document.createElement('div');
      spinner.id = `spinner-${stepId}`;
      spinner.classList.add('spinner-border', 'text-primary', 'mt-2');
      spinner.setAttribute('role', 'status');
      const spinnerLabel = document.createElement('span');
      spinnerLabel.classList.add('sr-only');
      spinnerLabel.textContent = 'Loading...';
      spinner.appendChild(spinnerLabel);
    }
    spinner.style.display = 'inline-block';
  } else if (spinner) {
    spinner.style.display = 'none';
  }

  return spinner;
}

function displayOpenAIResponse(stepId, responseData) {
  console.log('Response Data:', responseData); // Added for debugging
  // Combine 'message.content' for all elements of 'choices' array into a single message
  let combinedMessage = '';
  if (responseData.choices && responseData.choices.length) {
    combinedMessage = responseData.choices.map(choice => choice.message.content).join("\n");
  }
  const aiResponseTextarea = createOrUpdateTextArea(`ai-response-textarea-${stepId}`, combinedMessage, true);

  const submitButton = document.querySelector(`button[data-step-id="${stepId}"]`);
  // Changes start: Ensure correct positioning of the response textarea
  if (submitButton) {
    let textareaAfterSubmit = submitButton.nextElementSibling;
    if (textareaAfterSubmit && textareaAfterSubmit.id === `ai-response-textarea-${stepId}`) {
      // If textarea exists after the submit button, update it
      textareaAfterSubmit.value = aiResponse;
    } else {
      // If no textarea exists, create it and insert it after the submit button
      if (textareaAfterSubmit) {
        // Ensure the new textarea is inserted between the submit button and any subsequent elements
        submitButton.parentElement.insertBefore(aiResponseTextarea, textareaAfterSubmit);
      } else {
        // If submit button is the last child, just append the new textarea
        submitButton.parentElement.appendChild(aiResponseTextarea);
      }
    }
  }
  // Changes end
}

function createOrUpdateTextArea(id, value, disabled) {
  let textarea = document.getElementById(id);
  if (!textarea) {
    textarea = document.createElement('textarea');
    textarea.id = id;
    textarea.classList.add('form-control', 'mt-2', 'ai-response-textarea');
  }
  textarea.value = value;
  textarea.disabled = disabled;
  return textarea;
}

function displayApiError(error, stepId) {
  const errorMessage = `Error: ${error.message}`;
  const errorTextarea = createOrUpdateTextArea(`ai-response-textarea-${stepId}`, errorMessage, true);

  const submitButton = document.querySelector(`button[data-step-id="${stepId}"]`);
  if (submitButton.nextSibling && submitButton.nextSibling.id === `ai-response-textarea-${stepId}`) {
    submitButton.nextSibling.value = errorMessage;
  } else {
    submitButton.after(errorTextarea);
  }
}

function fetchAndDisplayDevelopmentSteps(taskIndex, appId, dbName) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/development_steps?task_index=${encodeURIComponent(taskIndex)}&app_id=${encodeURIComponent(appId)}&db=${encodeURIComponent(dbName)}`, true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      if (response.length === 0 || (typeof response === 'string' && response.includes('Development task index out of bounds'))) {
        displayNoDevelopmentStepsMessage();
      } else {
        displayDevelopmentSteps(response, taskIndex, appId, dbName);
      }
    } else {
      console.error('Failed to load development steps for the selected task');
      displayNoDevelopmentStepsMessage();
    }
  };
  xhr.onerror = function() {
    console.error('An error occurred during the Ajax request.');
    displayNoDevelopmentStepsMessage();
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

export { fetchAndDisplayDevelopmentSteps, displayDevelopmentSteps, createSubmitButton };