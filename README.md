📝 Secure Notes App

A secure notes application built with Node.js, Express, and PostgreSQL, using JWT for authentication and AES-256 encryption for note content. Users can register, log in, and manage their notes safely with full CRUD operations.

🚀 Features

🔐 User authentication with JWT
🛡️ Passwords hashed using bcrypt
🗝️ Notes encrypted before storing in the database
✏️ CRUD operations: Create, Read, Update, Delete notes
💻 Secure backend with parameterized queries to prevent SQL injection

Tech Stack

| Technology        | Purpose               |
| ----------------- | --------------------- |
| Node.js & Express | Backend framework     |
| PostgreSQL        | Database              |
| JWT               | Authentication        |
| AES-256-CBC       | Notes encryption      |
| bcrypt            | Password hashing      |
| Joi               | Input validation      |
| dotenv            | Environment variables |


Installation

Clone the repository:
git clone https://github.com/Barbatos-Tirpitz/secure-notes-app.git

cd secure-notes-app

Install dependencies:
npm install (install from package.json)

Setup environment variables:
Create a .env file in the root directory based on .env on example_env.txt

Run the server:
/secure-notes-app: node server.js

The server should run on http://localhost:5000.

Database Setup is on create_db.txt

API Endpoints
| Endpoint         | Method | Body                  | Description             |
| ---------------- | ------ | --------------------- | ----------------------- |
| `/auth/register` | POST   | `{ email, password }` | Register a new user     |
| `/auth/login`    | POST   | `{ email, password }` | Login and receive a JWT |


Auth Routes
| Endpoint     | Method | Body                 | Description            |
| ------------ | ------ | -------------------- | ---------------------- |
| `/notes`     | POST   | `{ title, content }` | Create a new note      |
| `/notes`     | GET    | -                    | Get all notes for user |
| `/notes/:id` | PUT    | `{ title, content }` | Update a note          |
| `/notes/:id` | DELETE | -                    | Delete a note          |

Notes Routes (Protected)
Headers:
Authorization: Bearer <YOUR_TOKEN>
Content-Type: application/json

| Endpoint     | Method | Body                 | Description                      |
| ------------ | ------ | -------------------- | -------------------------------- |
| `/notes`     | POST   | `{ title, content }` | Create a new note                |
| `/notes`     | GET    | -                    | Get all notes for logged-in user |
| `/notes/:id` | PUT    | `{ title, content }` | Update a note by ID              |
| `/notes/:id` | DELETE | -                    | Delete a note by ID              |


🔒 Security Practices

🔑 Passwords hashed using bcrypt

🕒 JWT authentication with expiration

🗝️ Notes encrypted with AES-256-CBC

💻 Parameterized SQL queries prevent SQL injection

This project uses vanilla HTML/JS frontend (or any frontend you choose).
Use Fetch API to call backend endpoints and include JWT token in Authorization headers.

License

This project is open-source and available under the MIT License.
