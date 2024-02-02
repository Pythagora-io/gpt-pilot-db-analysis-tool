# SQLite DB Analysis Tool

SQLite DB Analysis Tool is an application designed to facilitate the viewing and analysis of data within SQLite databases. It provides an interface for users to upload and repeatedly access their SQLite database files, explore the contained data, and perform analysis.

## Features

- **Upload or Select Database**: Users can upload new SQLite database files or select from previously uploaded ones.
- **Database Management**: Uploaded databases are stored on the server, eliminating the need for re-uploads during subsequent sessions.
- **Data Interaction**: Users can browse through apps, development tasks, and detailed development steps within the app, directly interacting with stored data.

## Project Structure

The application's backend is built with Node.js and Express, while the frontend is built using HTML, CSS, and JavaScript.

### Backend

The backend is responsible for handling database file uploads, storing these files, and providing endpoints for the frontend to retrieve data.

### Frontend

The frontend provides a user interface to interact with the uploaded databases, enabling users to explore and analyse the data in a friendly and intuitive manner.

## Getting Started

To get the project running locally on your machine:

1. Clone the project.
2. Install dependencies with `npm install`.
3. Start the server with `npm start`.
4. Access the application through your browser.

## API Overview

The application provides several APIs for data retrieval and manipulation:

- POST `/upload`: Endpoint to upload a new SQLite database file.
- GET `/databases`: Endpoint to retrieve a list of available databases.
- GET `/apps`: Endpoint to fetch apps within the selected database.
- Additional endpoints for development plans and steps as per the database schema.

## Database Schema

The application is designed to interact with SQLite databases following a specific schema, which includes tables such as `app`, `development_planning`, and `development_steps`.

## Contributing

Contributions to the project are welcome. Please ensure to follow the contributing guidelines laid out in the project's repository.

## License

This project is open-sourced under the MIT License.