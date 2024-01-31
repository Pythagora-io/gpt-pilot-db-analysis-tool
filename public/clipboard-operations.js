import { showToast } from './toast-notifications.js';

export function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      navigator.clipboard.writeText(text).then(function() {
        console.log('Content copied to clipboard.');
        showToast('Copied to clipboard!', 'success');
      }).catch(function(err) {
        console.error('Failed to copy using Clipboard API:', err.stack || err);
        showToast('Failed to copy to clipboard!', 'danger');
      });
    } catch (err) {
      console.error('Clipboard API is present, but an error occurred:', err.stack || err);
      showToast('Failed to copy to clipboard!', 'danger');
    }
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      console.log(successful ? 'Content copied to clipboard using execCommand.' : 'Failed copy operation using execCommand.');
      showToast(successful ? 'Copied to clipboard!' : 'Copy failed!', successful ? 'success' : 'danger');
    } catch (err) {
      console.error('Fallback method for copy failed:', err.stack || err);
      showToast('Copy failed!', 'danger');
    } finally {
      document.body.removeChild(textArea);
    }
  }
}

export function attachCopyButtonEvent(button, text) {
  button.addEventListener('click', function() {
    copyToClipboard(text);
  });
}