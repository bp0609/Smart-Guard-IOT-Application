# Project Setup

## Prerequisites

Before starting, ensure you have the following installed on your machine:

- **Node.js and npm:** [Download from nodejs.org](https://nodejs.org)
- **PostgreSQL:** [Download from postgresql.org](https://www.postgresql.org)

---

1. **File Structure:**

   Here’s a basic overview of the project structure:

   ```bash
   Smart-Guard-IOT-Application/
   ├── backend/
   │   └── src/
   │       ├── controllers/
   │       │   ├── alertController.ts
   │       │   ├── sensorController.ts
   │       │   └── ...
   │       ├── routes/
   │       │   ├── alertRoutes.ts
   │       │   ├── sensorRoutes.ts
   │       │   └── ...
   │       ├── database/
   │       └── index.ts
   ├── db/
   ├── frontend/
   │   ├── src/
   │   │   ├── components/
   │   │   │   ├── AlertsPage.tsx
   │   │   │   ├── Dashboard.tsx
   │   │   │   ├── Navbar.tsx
   │   │   │   └── ...
   │   │   ├── context/
   │   │   │   └── SelectionContext.tsx
   │   │   ├── utils/
   │   │   │   └── fetch.tsx
   │   │   ├── App.tsx
   │   │   └──  main.tsx
   │   └── public/
   ├── sensor_simulator.py
   ├── Makefile
   └── README.md
   ```

---

## Step 2: Setting Up

- Go to `frontend` folder and run `npm i`:
  
   ```bash
   cd frontend
   npm i
   ```

- Similarly for `backend`:

   ```bash
   cd backend
   npm i
   ```

---

## Step 3: Setting Up PostgreSQL

1. **Install PostgreSQL:**

   Follow the [installation guide](https://www.postgresql.org/download/) for your operating system.

2. **Create a Database:**

   Open your terminal or PostgreSQL client (like pgAdmin) and create a new database. For example, using the command line:

   ```bash
   psql -U postgres (for windows)
   sudo -u postgres psql (for linux)
   ```

   Then in the psql shell:

   ```sql
   CREATE DATABASE smart_guard;
   \q
   ```

3. **Connect from Node.js:**

   In your backend, you can create a database connection using the `pg` package. For example, in a file like `db.js`:

   ```javascript
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

## Step 4: Run the React App

1. Once installation is complete, Start the Vite dev server with::

   ```bash
   make start-frontend
   ```

2. In another terminal run

   ```bash
   make start-backend
   ```

3. Or alternatively you can run both using

   ```bash
   make dev
   ```

4. For other `make` help run

   ```bash
   make help
   ```

---

**Note**: For using Makefile for linux OS, copy the content of Makefile_linux and paste it into Makefile. Then, you'll be able to use it in linux.
