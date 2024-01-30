# SQLite_db_analysis_tool

The SQLite_db_analysis_tool is a web application designed to facilitate the examination and analysis of SQLite databases. It enables users to upload and manage SQLite database files, providing intuitive interactions to explore the data within.

## Features

- Users can upload SQLite database files, which are stored on the server for future sessions.
- A frontend interface allows for easy management and selection of uploaded databases.
- The application displays apps, development tasks, and development steps in a hierarchical structure.
- Ability to explore the chain of development steps for each task within an app.

## Database Schema

The SQLite database follows a consistent structure:

- **app**: Stores details of each app.
- **development_planning**: Holds the development tasks for each app.
- **development_steps**: Contains the progression of development steps associated with each app.

## Installation and Setup

To get started with the SQLite_db_analysis_tool:

1. Ensure you have Node.js and npm installed.
2. Clone the project repository.
3. Navigate to the project directory and run `npm install` to install dependencies.
4. Start the server using `npm start` command.

## Usage

Upon running the server, the web application will be accessible at `http://localhost:3000`. Users can select or upload SQLite databases and interact with the contained data through the web interface.

## API Endpoints

The application provides a set of RESTful endpoints to handle database interactions:

- `POST /upload`: Endpoint to upload new SQLite database files.
- `GET /databases`: Retrieves a list of uploaded SQLite database files.
- `GET /apps`: Fetches the list of apps from the selected database.
- `GET /development_plans`: Obtains development plans for a specific app.
- `GET /development_steps`: Retrieves the development steps for a selected development task.

## Contributions

Contributions to this project are welcome. Before submitting any changes, please review the project's contribution guidelines.

## License

This project is released under the terms of the MIT License.

## Acknowledgments

- SQLite
- Express.js
- Node.js

_This documentation is intended for the current state of the SQLite_db_analysis_tool project as of the knowledge cutoff in early 2023._