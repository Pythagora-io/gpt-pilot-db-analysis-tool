import { insertAfter } from './utils.js';
import { copyToClipboard } from './clipboard-operations.js';
import { showToast } from './toast-notifications.js';

function displayDevelopmentSteps(developmentSteps, taskIndex, appId, dbName) {
  console.log('Displaying development steps');
  const stepsContainer = document.createElement('div');
  stepsContainer.id = 'stepsContainer';
  stepsContainer.classList.add('mt-3');

  const heading = document.createElement('h3');
  heading.classList.add('mb-3');
  heading.textContent = 'Development Steps';
  stepsContainer.appendChild(heading);

  developmentSteps.forEach((step, index) => {
    console.log(`Processing step ${index + 1}`);
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
    const stepNumberSpan = document.createElement('span');
    stepNumberSpan.classList.add('step-number');
    stepNumberSpan.textContent = `Step ${step.id}:`;
    promptPathButton.appendChild(stepNumberSpan);
    const stepTitleText = document.createTextNode(` ${step.prompt_path}`);
    promptPathButton.appendChild(stepTitleText);
    promptPathButton.classList.add('card-title');
    cardBody.appendChild(promptPathButton);
    
    const collapseDiv = document.createElement('div');
    collapseDiv.id = `collapseStep${step.id}`;
    collapseDiv.classList.add('collapse');
    
    // Parse llm_response if it is a string
    let llmResponse;
    try {
      llmResponse = typeof step.llm_response === 'string' ? JSON.parse(step.llm_response) : step.llm_response;
    } catch (err) {
      console.error(`An error occurred while parsing llm_response for step ${step.id}:`, err);
      llmResponse = {};
    }

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

    // Parse messages if it is a string
    let messages;
    try {
      messages = typeof step.messages === 'string' ? JSON.parse(step.messages) : step.messages;
    } catch (err) {
      console.error(`An error occurred while parsing messages for step ${step.id}:`, err);
      messages = [];
    }
    
    const messagesContainer = document.createElement('div');
    messagesContainer.classList.add('mb-2');
    if (messages && messages.length > 0) {
      messages.forEach((message, messageIndex) => {
        const messageContentElement = document.createElement('textarea');
        messageContentElement.value = message.content;
        messageContentElement.classList.add('form-control', 'mb-1', 'message-content');
        messageContentElement.setAttribute('data-index', messageIndex);
        messageContentElement.setAttribute('data-role', message.role || 'user'); // Set 'user' as default role if missing
      
        const messageRoleLabel = document.createElement('h6');
        messageRoleLabel.textContent = `Role: ${message.role}`;
        messageRoleLabel.classList.add('mb-1');
      
        messagesContainer.appendChild(messageRoleLabel);
        messagesContainer.appendChild(messageContentElement);
      });

      const copyConversationButton = document.createElement('button');
      copyConversationButton.textContent = 'COPY CONVERSATION';
      copyConversationButton.classList.add('btn', 'btn-secondary', 'btn-sm', 'copy-conversation-btn');
      copyConversationButton.disabled = messages.length === 0;
      copyConversationButton.addEventListener('click', function() {
        try {
          const stepData = {
            prompt_path: step.prompt_path,
            messages: messages,
            llm_response: llmResponse,
            prompt_data: step.prompt_data
          };
          copyToClipboard(stepData);
        } catch (error) { // Added the catch clause to handle any potential errors
          showToast('Failed to copy step data. ' + error.message, 'danger');
        }
      });
      messagesContainer.appendChild(copyConversationButton);
    } else {
      console.log('No messages to display for this step.');
      const noMessagesText = document.createElement('p');
      noMessagesText.textContent = 'No messages available for this step.';
      messagesContainer.appendChild(noMessagesText);
    }
      
    const submitButton = createSubmitButton(step.id);
    messagesContainer.appendChild(submitButton);
    collapseDiv.appendChild(messagesContainer);

    // prompt_data processing is removed from UI rendering logic
    // Nothing to render for prompt_data in the UI, it is still copied by copyToClipboard function
    
    cardBody.appendChild(collapseDiv);
    stepsContainer.appendChild(stepItemContainer);
  });

  const appsContainer = document.getElementById('appsContainer');
  const previousStepsContainer = document.getElementById('stepsContainer');
  if (previousStepsContainer) {
    console.log('Replacing old steps container with new one.');
    appsContainer.replaceChild(stepsContainer, previousStepsContainer);
  } else {
    console.log('Appending new steps container.');
    appsContainer.appendChild(stepsContainer);
  }
}

function createSubmitButton(stepId) {
  console.log(`Creating submit button for stepId: ${stepId}`);
  const submitButton = document.createElement('button');
  submitButton.textContent = 'Submit';
  submitButton.classList.add('btn', 'btn-primary', 'mt-2');
  submitButton.setAttribute('data-step-id', stepId.toString());
  submitButton.addEventListener('click', () => {
    console.log(`Submit button clicked for stepId: ${stepId}`);
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
  console.log(`Submitting messages for stepId: ${stepId}`);
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
    console.error('Error submitting messages to server:', error);
    showSpinner(stepId, false);
    submitButton.disabled = false;
    displayApiError(error, stepId);
  });
}

function showSpinner(stepId, shouldShow) {
  console.log(`Showing spinner for stepId: ${stepId}, shouldShow: ${shouldShow}`);
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
  console.log(`Displaying OpenAI response for stepId: ${stepId}`, responseData);
  let combinedMessage = '';
  if (responseData.choices && responseData.choices.length) {
    combinedMessage = responseData.choices.map(choice => choice.message.content).join("\n");
  }
  const aiResponseTextarea = createOrUpdateTextArea(`ai-response-textarea-${stepId}`, combinedMessage, true);

  const submitButton = document.querySelector(`button[data-step-id="${stepId}"]`);
  insertAfter(aiResponseTextarea, submitButton);
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
  console.error(`Displaying API error for stepId: ${stepId}`, error);
  const errorMessage = `Error: ${error.message}`;
  const errorTextarea = createOrUpdateTextArea(`ai-response-textarea-${stepId}`, errorMessage, true);

  const submitButton = document.querySelector(`button[data-step-id="${stepId}"]`);
  insertAfter(errorTextarea, submitButton);
}

function fetchAndDisplayDevelopmentSteps(taskIndex, appId, dbName) {
  console.log(`Fetching and displaying development steps for taskIndex: ${taskIndex}, appId: ${appId}`);
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
      console.error('Failed to load development steps for the selected task', xhr.statusText);
      displayNoDevelopmentStepsMessage();
    }
  };
  xhr.onerror = function(e) {
    console.error('An error occurred during the Ajax request.', e);
    displayNoDevelopmentStepsMessage();
  };
  xhr.send();
}

function displayNoDevelopmentStepsMessage() {
  console.log('Displaying message: No development steps found for this task.');
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