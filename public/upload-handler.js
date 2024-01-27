export function initializeUploadForm(fetchAndDisplayApps, fetchDatabasesAndPopulateDropdown) {
  const form = document.getElementById('uploadForm');
  let selectedDatabaseName = "";

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const dbNameInput = document.getElementById('dbName');
    const dbFileInput = document.getElementById('dbFile');
    const dbName = dbNameInput.value.trim();
    const dbFile = dbFileInput.files[0];

    if (!dbName) {
      alert('Please enter a name for the database');
      return;
    }

    if (!dbFile || !(/\.(sqlite|db)$/i).test(dbFile.name)) {
      alert('Please upload a valid SQLite database file (.sqlite or .db)');
      return;
    }

    const formData = new FormData();
    formData.append('dbname', dbName);
    formData.append('dbfile', dbFile);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        const responseMessage = xhr.responseText;
        if (xhr.status === 200) {
          alert('Database uploaded successfully');
          selectedDatabaseName = dbName; // Set the current database name
          fetchAndDisplayApps(dbName); // Update the displayed apps
          fetchDatabasesAndPopulateDropdown(); // Update the dropdown list
        } else {
          alert(`An error occurred during the upload: ${responseMessage}`);
        }
      }
    };
    xhr.send(formData);
  });
}