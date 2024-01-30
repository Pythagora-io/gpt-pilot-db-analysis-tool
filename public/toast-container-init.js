document.addEventListener('DOMContentLoaded', (event) => {
  const toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
  toastContainer.id = 'toastContainer';
  document.body.appendChild(toastContainer);
  console.log('Toast container initialized.');
});

export {};