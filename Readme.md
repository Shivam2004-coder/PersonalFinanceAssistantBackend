# Backend API Documentation

This repository contains the backend code for a web application that manages user authentication, transactions, profiles, graphs, and PDF parsing using Google's Gemini AI API.

---

## Table of Contents

- [Technologies](#technologies)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Routes](#api-routes)
  - [Authentication Routes](#authentication-routes)
  - [Gemini AI Routes](#gemini-ai-routes)
  - [Graph Routes](#graph-routes)
  - [Profile Routes](#profile-routes)
  - [Transaction Routes](#transaction-routes)
- [Middleware](#middleware)
- [License](#license)

---

## Technologies

- Node.js
- Express.js
- Google Gemini AI API
- JWT Authentication
- MongoDB (optional, depending on your database setup)

---

## Installation

1. Clone the repository:

git clone <your-repo-url>

2. Install dependencies:

cd <your-project-folder>
npm install


3. Start the server:

npm run dev   # if using nodemon
# or
node app.js


## Environment Variables

Create a .env file in the root directory and add the following variables:

- **PORT=5000**
- **MONGO_URI=<your-mongodb-uri>**
- **JWT_SECRET=<your-jwt-secret>**
- **GEMINI_API_KEY=<your-google-gemini-api-key>**


## API Routes

### Authentication Routes

| Method | Route        | Description        | Auth Required |
| ------ | ------------ | ----------------- | ------------- |
| POST   | /signup      | Manual user signup | No            |
| POST   | /login       | Manual user login  | No            |
| GET    | /auth/google | Google OAuth login | No            |
| POST   | /logout      | Logout user        | Yes           |

### Gemini AI Routes

| Method | Route           | Description                                             | Auth Required |
| ------ | --------------- | ------------------------------------------------------- | ------------- |
| POST   | /gemini/search  | Parse PDF and extract transaction details using Google Gemini AI | Yes           |

### Graph Routes

| Method | Route  | Description                     | Auth Required |
| ------ | ------ | ------------------------------- | ------------- |
| GET    | /graph | Retrieve transaction graph data | Yes           |

### Profile Routes

| Method | Route          | Description       | Auth Required |
| ------ | -------------- | ---------------- | ------------- |
| GET    | /profile/view  | View user profile | Yes           |

### Transaction Routes

| Method | Route                  | Description                        | Auth Required |
| ------ | --------------------- | --------------------------------- | ------------- |
| POST   | /transaction/add       | Add a new transaction              | Yes           |
| POST   | /transaction           | Search for transactions            | Yes           |
| POST   | /transaction/update    | Update an existing transaction     | Yes           |
| DELETE | /transaction/delete    | Delete a transaction               | Yes           |

### Middleware

| Middleware | Description                                      |
| ---------- | ------------------------------------------------ |
| userAuth   | Verifies JWT tokens and authenticates users for protected routes |


## License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
