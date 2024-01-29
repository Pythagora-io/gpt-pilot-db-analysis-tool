# SQLite Database Analysis Tool

The SQLite Database Analysis Tool is an application designed to provide comprehensive analysis of SQLite databases. It allows users to upload, view, and analyze data stored in SQLite database files.

## Features

- **Database Upload**: Upload and store SQLite databases on the server for later access.
- **Database Selection**: Select a database from a dropdown of previously uploaded databases or upload a new one.
- **Data Interaction**: Interact with uploaded databases to:
  - View listed apps.
  - Explore development tasks associated with an app.
  - Examine development steps within a development task.
- **Data Presentation**: Display detailed information including prompt paths, messages, responses from language learning models (LLMs), and prompt data.

## Prerequisites

- Node.js
- npm package manager

## Local Setup

1. Clone this repository to your local machine.
2. Install dependencies with `npm install`.
3. Start the application using `npm start`. The application will be available at `http://localhost:3000`.

## Project Structure

- The SQLite database should have the following tables:
  - `app`
  - `development_planning`
  - `development_steps`

## API Reference

- `POST /upload`: Upload a SQLite database file.
- `GET /databases`: List available databases.
- `GET /apps`: List all apps from a database.
- `GET /development_plans`: Get development plans for an app based on its ID.
- `GET /development_steps`: Retrieve development steps for a specific development task.

## Usage

- Use the web interface to upload a new SQLite database or select an existing one.
- Navigate through the apps, development tasks, and development steps to analyze the stored data.

## Contributions

- Contributions are welcome. Please read the project's `CONTRIBUTING.md` first (if available).

## License

- This project is open-sourced under the MIT License. See the `LICENSE` file for more details.