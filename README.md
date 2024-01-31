# SQLite_db_analysis_tool

SQLite_db_analysis_tool is a web application designed to allow users to view and analyze data stored in SQLite databases. The tool provides a user-friendly frontend interface for uploading and managing databases, and it supports detailed inspection of database contents.

## Project Structure

The project consists of a Node.js backend and a frontend utilizing HTML, CSS, and JavaScript. The backend is responsible for handling SQLite database file uploads, storage, and data retrieval. It exposes RESTful endpoints to the frontend for these operations.

### Backend

The server is implemented in `app.js`, using the Express framework and includes additional routes defined in the `developmentPlans.js` and `developmentSteps.js` files.

Key features include:
- Database file upload and storage mechanism.
- REST API endpoints to list databases, fetch apps, development plans, and steps.
- Middleware for processing and categorizing development steps based on prompt path.

### Frontend

The frontend is a set of static HTML, CSS, and JavaScript files. Users can select existing databases, upload new ones, and navigate through apps, development plans, and steps.

Key interfaces include:
- Database selection and upload.
- Display of apps and their related development details.

Key JavaScript modules responsible for these features are `database-selection.js`, `development-steps.js`, and `upload-handler.js`.

## Database Schema

The SQLite database conforms to a particular schema where `app` contains app details, `development_planning` stores development tasks for apps, and `development_steps` holds individual steps for development tasks.

## Setup and Usage

To set up the application:

1. Clone the repository.
2. Run `npm install` to install the required dependencies.
3. Start the server using `npm start`.

Once the server is running, the front end can be accessed via a web browser to manage and analyze SQLite databases.

## API Reference

The backend offers several API endpoints:

- POST `/upload`: Upload a new SQLite database file.
- GET `/databases`: List all uploaded SQLite database files.
- GET `/apps`: Get all apps from the selected SQLite database.
- GET `/development_plans`: Get all development tasks for a specific app.
- GET `/development_steps`: Get all steps for a particular development task.

## Dependencies

- `express`
- `multer` for handling multipart/form-data.
- `sqlite3` for interacting with SQLite databases.
- `cors` for enabling CORS.
- `body-parser` for parsing incoming request bodies.
- `dotenv` for loading environment variables.

For the full list of dependencies, refer to `package.json`.

## Contributing

Contributions are welcome. For major changes, please open an issue first to discuss what you would like to change or add.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.
