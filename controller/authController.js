
const jwt = require('jsonwebtoken');
const { getUserByEmail, createUser, comparePassword } = require('../models/userModel');
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per `windowMs`
  message: 'Too many login attempts from this IP, please try again after 15 minutes',
  statusCode: 429, // HTTP status code for too many requests
  headers: true, // Enable the "X-RateLimit-Remaining" and "X-RateLimit-Reset" headers
});

// Register User
// exports.register = (req, res) => {
//   const { email, password } = req.body;
//   // Check if user exists
//   getUserByEmail(email, (err, user) => {
//     if (user) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Create new user
//     createUser(email, password, (err, result) => {
//       if (err) {
//         return res.status(500).json({ message: 'Server Error' });
//       }

//       // Generate JWT token
//       const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: '1h' });

//       res.status(201).json({ message: 'User registered successfully', token });
//     });
//   });
// };



exports.login = [loginLimiter, (req, res) => {
  const { email, password } = req.body;
  // Get user by email
  getUserByEmail(email, (err, user) => {
    if (!user) {
      return res.status(400).json({ message: 'Invalid User Name or Password' });
    }
    // Compare passwords
    comparePassword(password, user.userPassword, (err, isMatch) => {
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid User Name or Password' });
      }
      // Generate JWT token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ message: 'Login successfully', token });
    });
  });
}];