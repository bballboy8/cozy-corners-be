// server.js

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
    host: process.env.DB_HOST,         // Use 127.0.0.1
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD  || '',
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3307,  // Use the DB_PORT from .env, defaulting to 3307
  });

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
  console.log('Database connected');
});

// Make the database connection available globally
global.db = db;

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/creditCards', creditCardRoutes); 

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
