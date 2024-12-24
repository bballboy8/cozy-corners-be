// routes/authRoutes.js

const express = require('express');
const helmet = require('helmet');

const router = express.Router();
const { register, login } = require('../controller/authController');

router.use(helmet());
// Register route
//router.post('/register', register);

// Login route
router.post('/login', login);

module.exports = router;
