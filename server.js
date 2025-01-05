require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const authRoutes = require('./routes/authRoutes');
const creditCardRoutes = require('./routes/creditCardRoutes');
const cors = require('cors');
const helmet = require('helmet');


const app = express();

app.use(cors());
app.use(helmet());

// Middleware to parse JSON
app.use(express.json());

//check the variables before using them 
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_NAME', 'DB_PORT'];
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`Environment variable ${envVar} is missing. Please check your .env file.`);
    process.exit(1); // Exit the application if a required variable is missing
  }
});

// MySQL Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3307,
});

// Database connection logging for Lambda (no exit)
db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected');
  }
});

// Make the database connection available globally
global.db = db;

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/creditCards', creditCardRoutes);

module.exports = app; // Export the app for Lambda usage