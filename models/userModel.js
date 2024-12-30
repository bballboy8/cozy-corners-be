const bcrypt = require('bcryptjs');

// Function to get user by email
const getUserByEmail = (email, callback) => {
  const query = 'SELECT * FROM tbl_login WHERE userName = ?';
  global.db.query(query, [email], (err, results) => {
    if (err) {
      // Log the error and return a friendly message
      console.error('Database error in getUserByEmail:', err);
      callback({ message: 'An error occurred while fetching user data.', error: err }, null);
    } else if (results.length === 0) {
      // If no user found
      callback({ message: 'User not found.' }, null);
    } else {
      callback(null, results[0]);
    }
  });
};

// Function to create a new user
const createUser = (email, password, callback) => {
  // Hash password before saving
  bcrypt.hash(password, 14, (err, hashedPassword) => {
    if (err) {
      // Log bcrypt error
      console.error('Error hashing password:', err);
      callback({ message: 'Error hashing password.', error: err }, null);
    } else {
      const query = 'INSERT INTO tbl_login (userName, userPassword) VALUES (?, ?)';
      global.db.query(query, [email, hashedPassword], (err, results) => {
        if (err) {
          // Log the error and return a friendly message
          console.error('Database error in createUser:', err);
          callback({ message: 'An error occurred while creating the user.', error: err }, null);
        } else {
          callback(null, results);
        }
      });
    }
  });
};

// Function to compare passwords
const comparePassword = (candidatePassword, storedPassword, callback) => {
  bcrypt.compare(candidatePassword, storedPassword, (err, isMatch) => {
    if (err) {
      // Log bcrypt comparison error
      console.error('Error comparing passwords:', err);
      callback({ message: 'Error comparing passwords.', error: err }, false);
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
