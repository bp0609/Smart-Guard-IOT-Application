// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api', (req, res) => {
  res.send('Backend is running!');
});

// Example: Import sensor routes (to be implemented)
// const sensorRoutes = require('./routes/sensors');
// app.use('/api/sensors', sensorRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
