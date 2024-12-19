// models/userModel.js

const bcrypt = require('bcryptjs');

// Function to get user by email
const getUserByEmail = (email, callback) => {
  const query = 'SELECT * FROM tbl_login WHERE userName = ?';
  global.db.query(query, [email], (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results[0]);
    }
  });
};

// Function to create a new user
const createUser = (email, password, callback) => {
  // Hash password before saving
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      callback(err, null);
    } else {
      const query = 'INSERT INTO tbl_login (userName, userPassword) VALUES (?, ?)';
      global.db.query(query, [email, hashedPassword], (err, results) => {
        callback(err, results);
      });
    }
  });
};

// Function to compare passwords
const comparePassword = (candidatePassword, storedPassword, callback) => {
  bcrypt.compare(candidatePassword, storedPassword, (err, isMatch) => {
    if (err) {
      callback(err, false);
    } else {
      callback(null, isMatch);
    }
  });
};

module.exports = {
  getUserByEmail,
  createUser,
  comparePassword,
};
