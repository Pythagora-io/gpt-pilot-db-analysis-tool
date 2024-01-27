# SQLite Database Analysis Tool

The SQLite Database Analysis Tool is an application designed to facilitate the viewing and analysis of data stored within a SQLite database. The tool comes with a web-based front-end and a backend server to parse and present the data in an organized manner.

## Features

- Upload a SQLite database file and store it on the server for future use.
- Browse previously uploaded database files.
- View all the apps defined in the uploaded database.
- Navigate through and analyze specific development tasks and their associated development steps for each app.
- Present detailed information about development steps including messages, responses from LLM (Language Learning Models), and prompt data.

## Database Structure

The SQLite database expected by the tool should follow this predefined structure:

- An `app` table containing records of all apps.
- A `development_planning` table where each app's multiple development tasks are stored as an array in the JSON key `development_plan`.
- A `development_steps` table where every development step is linked to its corresponding app by an `app_id` key.

## Getting Started

1. Clone the repository to your local machine.
2. Navigate to the root directory of the project and run `npm install` to install all the required dependencies.
3. Start the server by running the command `npm start`. The app will now be running on the default port 3000 unless specified otherwise.

## Usage

After starting the server:

1. Open your web browser and navigate to `http://localhost:3000`.
2. From the homepage, you can either upload a new SQLite database file or select one from the dropdown of previously uploaded databases.
3. Upon selection or upload of a database, you can interact with the displayed list of apps and their development tasks and steps.

## API Endpoints

The server exposes several RESTful API endpoints:

- `POST /upload`: Endpoint to upload a new SQLite database file.
- `GET /databases`: Retrieve a list of available databases on the server.
- `GET /apps`: List all the apps from the selected database.
- `GET /development_plans`: Get the development plans for a specific app based on the app ID.
- `GET /development_steps`: Retrieve the development steps for a specified development task within an app.

## Contributing

Contributions are welcome. Please feel free to fork the repository, make your changes, and create a pull request.

## License

Distributed under the MIT License. See `LICENSE` file for more information.
