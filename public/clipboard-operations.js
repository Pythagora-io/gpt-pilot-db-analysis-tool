import { showBootstrapToast } from './toast.js';

export function copyToClipboard(data) {
  console.log('Initiating copy to clipboard operation');
  const jsonString = JSON.stringify(data, null, 2);
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(jsonString).then(() => {
      console.log('Successfully copied data to clipboard using Clipboard API');
      showBootstrapToast('Copied to clipboard!', 'success');
    }).catch((err) => {
      console.error('Clipboard API Copy Error with trace:', err);
      showBootstrapToast('Failed to copy data. Please try again!', 'danger');
    });
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = jsonString;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'absolute';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      console.log(successful ? 'Successfully copied data to clipboard using execCommand' : 'Failed to copy using execCommand');
      document.body.removeChild(textArea);
      showBootstrapToast(successful ? 'Copied to clipboard!' : 'Failed to copy!', successful ? 'success' : 'danger');
    } catch (err) {
      document.body.removeChild(textArea);
      console.error('execCommand Copy Error with trace:', err);
      showBootstrapToast('Failed to copy. Please try again!', 'danger');
    }
  }
}

export function attachCopyButtonEvent(button, data) {
  button.addEventListener('click', function() {
    try {
      console.log('Copy button clicked, attempting to copy data');
      copyToClipboard(data);
    } catch (error) {
      console.error('Copy to clipboard failed with trace:', error);
      showBootstrapToast('Failed to copy messages. ' + error.message, 'danger');
    }
  });
}