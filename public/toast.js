export function showBootstrapToast(message, type) {
 const toastContainer = document.getElementById('toastContainer') || createToastContainer();
 const toast = createToast(message, type);
 toastContainer.appendChild(toast);
 const toastInstance = new bootstrap.Toast(toast);
 toastInstance.show();
}

function createToast(message, type) {
 const toast = document.createElement('div');
 toast.className = `toast align-items-center text-white bg-${type} border-0`;
 toast.role = 'alert';
 toast.ariaLive = 'assertive';
 toast.ariaAtomic = 'true';
 const toastBody = document.createElement('div');
 toastBody.className = 'd-flex';
 const toastMessage = document.createElement('div');
 toastMessage.className = 'toast-body';
 toastMessage.textContent = message;
 const toastButton = document.createElement('button');
 toastButton.type = 'button';
 toastButton.className = 'btn-close me-2 m-auto';
 toastButton.dataset.bsDismiss = 'toast';
 toastButton.ariaLabel = 'Close';
 toastBody.appendChild(toastMessage);
 toastBody.appendChild(toastButton);
 toast.appendChild(toastBody);
 return toast;
}

function createToastContainer() {
 const container = document.createElement('div');
 container.id = 'toastContainer';
 container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
 container.style.zIndex = '11';
 document.body.appendChild(container);
 return container;
}
