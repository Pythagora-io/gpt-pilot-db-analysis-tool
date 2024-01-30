import { showToast } from './toast-notifications.js';

export function copyToClipboard(data) {
  console.log('Initiating copy to clipboard operation...');
  const jsonString = JSON.stringify(data, null, 2);
  if (navigator.clipboard && window.isSecureContext) {
    // Asynchronously attempt to copy data to the clipboard.
    navigator.clipboard.writeText(jsonString).then(() => {
      console.log('Data successfully copied to clipboard using Clipboard API.');
      console.log('About to show toast notification for successful clipboard copy.');
      showToast('Copied to clipboard!', 'success');
    }).catch((err) => {
      // Log the full error trace and notify the user of the failure.
      console.error('Clipboard API Copy Error: ', err);
      console.log('About to show toast notification for failed clipboard copy.');
      showToast('Failed to copy data. Please try again!', 'danger');
    });
  } else {
    // Fallback copy method for browsers where the Clipboard API is not available.
    const textArea = document.createElement('textarea');
    textArea.value = jsonString;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'absolute';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    let successful;
    try {
      successful = document.execCommand('copy');
      console.log(successful ? 'Data successfully copied to clipboard using execCommand.' : 'Failed to copy using execCommand.');
      console.log(`About to show toast notification for ${successful ? 'successful' : 'failed'} execCommand copy.`);
      showToast(successful ? 'Copied to clipboard!' : 'Failed to copy!', successful ? 'success' : 'danger');
    } catch (err) {
      // Log the full error trace and notify the user of the failure.
      console.error('execCommand Copy Error: ', err.stack || err);
      showToast('Failed to copy. Please try again!', 'danger');
      successful = false;
    } finally {
      // Clean up the text area from the DOM regardless of copy success.
      document.body.removeChild(textArea);
    }
    if (!successful) {
      console.log('Fallback document.execCommand copy was unsuccessful.');
    }
  }
}

export function attachCopyButtonEvent(button, data) {
  button.addEventListener('click', function() {
    console.log('Copy button was clicked, attempting copy to clipboard...');
    try {
      copyToClipboard(data);
    } catch (error) {
      // Log the full error trace and notify the user of the failure.
      console.error('Error in copying to clipboard: ', error.stack || error);
      showToast('Failed to copy messages. ' + error.message, 'danger');
    }
  });
}