# Project Setup

## Prerequisites

Before starting, ensure you have the following installed on your machine:

- **Node.js and npm:** [Download from nodejs.org](https://nodejs.org)
- **PostgreSQL:** [Download from postgresql.org](https://www.postgresql.org)

---

## Step 1: Project Setup and File Structure

1. **Clone the main project:**

2. **Create Separate Folders for Frontend and Backend:**

   ```bash
   mkdir backend frontend
   ```

3. **Suggested File Structure:**

   Here’s a basic overview of the project structure:

   ```
   IoT-project/
   ├── backend/
   │   ├── controllers/
   │   │   └── sensorController.js   # (Handles sensor data logic)
   │   ├── routes/
   │   │   └── sensors.js            # (Defines API endpoints)
   │   ├── .env                      # (Environment variables, e.g., DB credentials)
   │   ├── index.js                  # (Main Express server file)
   │   ├── package.json
   │   └── README.md
   ├── frontend/
   │   ├── public/
   │   ├── src/
   │   │   ├── components/           # (React components)
   │   │   ├── App.js                # (Main React component)
   │   │   └── index.js              # (Entry point for React)
   │   ├── package.json
   │   └── README.md
   └── README.md
   ```

---

## Step 2: Setting Up the Backend (Node.js with Express)

1. **Initialize a Node.js Project:**

   Navigate into the backend folder and initialize your project:

   ```bash
   cd backend
   npm init -y
   ```

2. **Install Dependencies:**

   Install Express, PostgreSQL client (`pg`), CORS, and dotenv for environment variables:

   ```bash
   npm install express pg cors dotenv axios
   ```

3. **Create the Server File (`index.js`):**

   In `backend/index.js`, add the following starter code:

   ```javascript
   // backend/index.js
   require("dotenv").config();
   const express = require("express");
   const cors = require("cors");
   const app = express();
   const port = process.env.PORT || 5000;

   // Middleware
   app.use(cors());
   app.use(express.json());

   // Simple route
   app.get("/", (req, res) => {
     res.send("Backend is running!");
   });

   // Import routes (example: sensors)
   // const sensorRoutes = require('./routes/sensors');
   // app.use('/api/sensors', sensorRoutes);

   app.listen(port, () => {
     console.log(`Server is running on port ${port}`);
   });
   ```

4. **Setup Environment Variables:**

   Create a file named `.env` in the backend folder. Example contents:

   ```env
   PORT=5000
   DB_USER=postgres
   DB_HOST=localhost
   DB_DATABASE=smart_guard
   DB_PASSWORD=your_db_password
   DB_PORT=5432
   ```

---

## Step 3: Setting Up the Frontend (React)

1. **Initialize the React App:**

   Navigate to the `frontend` folder and create a new React + Typescript app using vite:

   ```bash
   cd ../frontend
   npm create vite@latest . --template react
   npm install
   ```

2. **Run the React App:**

   Once installation is complete, Start the Vite dev server with::

   ```bash
   npm run dev
   ```

   Your browser should open [http://localhost:3000](http://localhost:3000) with the default React page.

---

## Step 4: Setting Up PostgreSQL

1. **Install PostgreSQL:**

   Follow the [installation guide](https://www.postgresql.org/download/) for your operating system.

2. **Create a Database:**

   Open your terminal or PostgreSQL client (like pgAdmin) and create a new database. For example, using the command line:

   ```bash
   psql -U postgres
   ```

   Then in the psql shell:

   ```sql
   CREATE DATABASE smart_guard;
   \q
   ```

3. **Connect from Node.js:**

   In your backend, you can create a database connection using the `pg` package. For example, in a file like `db.js`:

   ```javascript
   // backend/db.js
   const { Pool } = require("pg");
   const pool = new Pool({
     user: process.env.DB_USER,
     host: process.env.DB_HOST,
     database: process.env.DB_DATABASE,
     password: process.env.DB_PASSWORD,
     port: process.env.DB_PORT,
   });

   module.exports = pool;
   ```

---

## Step 5: Running the Initial Project

1. **Start the Backend Server:**

   In the `backend` folder, run:

   ```bash
   node index.js
   ```

   (Optionally, install and use `nodemon` for automatic server reloads during development:

   ````bash
   npm install -g nodemon
   nodemon index.js
   ```)

   ````

2. **Start the Frontend Development Server:**

   In the `frontend` folder, run:

   ```bash
   npm start
   ```

3. **Verify:**

   - Visit [http://localhost:5000](http://localhost:5000) in your browser to see your backend welcome message.
   - Visit [http://localhost:3000](http://localhost:3000) to see your React application.

---
