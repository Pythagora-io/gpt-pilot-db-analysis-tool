import { fetchAndDisplayApps } from './shared.js';
import { initializeUploadForm } from './upload-handler.js';

const existingDbsSelect = document.getElementById('existingDbs');

function fetchDatabasesAndPopulateDropdown() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/databases', true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      const databases = JSON.parse(xhr.responseText);
      while(existingDbsSelect.options.length > 1) {
        existingDbsSelect.remove(1);
      }
      databases.forEach(function(database) {
        const option = document.createElement('option');
        const dbNameWithoutExtension = database.name.replace(/\.(sqlite|db)$/i, '');
        option.textContent = dbNameWithoutExtension;
        option.value = dbNameWithoutExtension;
        existingDbsSelect.appendChild(option);
      });
    } else {
      alert('Failed to load databases');
    }
  };
  xhr.send();
}

document.addEventListener('DOMContentLoaded', function() {
  fetchDatabasesAndPopulateDropdown();
  initializeUploadForm(fetchAndDisplayApps, fetchDatabasesAndPopulateDropdown);
});

existingDbsSelect.addEventListener('change', function() {
  if (existingDbsSelect.value) {
    fetchAndDisplayApps(existingDbsSelect.value);
  }
});

export { fetchDatabasesAndPopulateDropdown };