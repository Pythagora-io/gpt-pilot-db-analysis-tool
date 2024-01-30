import { showToast } from './toast-notifications.js';

export function copyToClipboard(stepData) {
  // Create the data structure for the step data
  const dataToCopy = {
    prompt_path: stepData.prompt_path,
    messages: stepData.messages,
    llm_response: stepData.llm_response,
    prompt_data: stepData.prompt_data
  };

  // Stringify the data to copy
  const jsonString = JSON.stringify(dataToCopy, null, 2);

  // Try to use the Clipboard API if available
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(jsonString).then(() => {
      showToast('Data copied to clipboard!', 'success');
      console.log('Data successfully copied to clipboard.');
    }).catch((err) => {
      console.error('Could not copy text to clipboard: ', err);
      showToast('Copy failed, please try manually.', 'danger');
      console.error('Clipboard API error with trace:', err);
    });
  } else {
    // Fallback to textarea method for browsers without Clipboard API support
    const textArea = document.createElement('textarea');
    textArea.value = jsonString;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      showToast(successful ? 'Data copied to clipboard!' : 'Copy failed, please try manually.', successful ? 'success' : 'danger');
      console.log(successful ? 'Data successfully copied to clipboard using document.execCommand.' : 'Failed to copy data using document.execCommand.');
    } catch (err) {
      console.error('Fallback copy text error: ', err);
      showToast('Copy failed, please try manually.', 'danger');
      console.error('execCommand Copy Error with trace:', err);
    } finally {
      document.body.removeChild(textArea);
    }
  }
}