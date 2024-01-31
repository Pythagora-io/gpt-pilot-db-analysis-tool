import { showToast } from './toast-notifications.js';

export function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard!', 'success');
      console.log('Content copied to clipboard.');
    }).catch((err) => {
      showToast('Failed to copy to clipboard!', 'danger');
      console.error('Failed to copy using Clipboard API:', err);
    });
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      showToast(successful ? 'Copied to clipboard!' : 'Copy failed!', successful ? 'success' : 'danger');
      console.log(successful ? 'Copied content using execCommand.' : 'Copy using execCommand failed.');
    } catch (err) {
      showToast('Failed to copy to clipboard!', 'danger');
      console.error('Fallback for Clipboard API failed:', err);
    } finally {
      document.body.removeChild(textArea);
    }
  }
}
