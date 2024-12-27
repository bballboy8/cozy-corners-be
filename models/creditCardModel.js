const validator = require('validator'); // For validating inputs like email, card number, etc.
const sanitizeHtml = require('sanitize-html'); // To sanitize any HTML input
var luhn = require("luhn");

const createCreditCard = (firstName, lastName, contact, Address, Email, cardHolderName, cardNo, expiryDate, cvvCode, callback) => {
  // Step 1: Input sanitization
  
  // Sanitize strings to prevent any HTML or script injections
  firstName = sanitizeHtml(firstName);
  lastName = sanitizeHtml(lastName);
  contact = sanitizeHtml(contact);
  Address = sanitizeHtml(Address);
  cardHolderName = sanitizeHtml(cardHolderName);
  
  // Sanitize and validate email
  Email = sanitizeHtml(Email);
  if (!validator.isEmail(Email)) {
    return callback({ message: 'Invalid email format.' }, null);
  }

  // Validate and sanitize card number and CVV code (ensure they are numeric and valid)
  cardNo = cardNo.replace(/\D/g, ''); // Remove any non-digit characters
  cvvCode = cvvCode.replace(/\D/g, ''); // Remove any non-digit characters

  // Step 2: Input validation

  // Validate the card number using Luhn algorithm (for example, using validator library or custom logic)
  if (!luhn.validate(cardNo)) {
    return callback({ message: 'Provide correct card no.' }, null);
  }


  if (!validator.isNumeric(cardNo)) {
    return callback({ message: 'Card number must only contain numeric characters.' }, null);
  }

  // Validate expiry date format (MM/YY)
  if (!validator.matches(expiryDate, /^(0[1-9]|1[0-2])\/\d{2}$/)) {
    return callback({ message: 'Invalid expiry date format. Expected MM/YY.' }, null);
  }

  // Validate CVV (3 digits for Visa/Mastercard, 4 for American Express)
  if (!validator.isLength(cvvCode, { min: 3, max: 4 })) {
    return callback({ message: 'CVV must be 3 or 4 digits.' }, null);
  }

  // Step 3: Check if card already exists
  const querymatch = 'SELECT * FROM tbl_cards WHERE cardNo = ?';
  global.db.query(querymatch, [cardNo], (err, results) => {
    if (err) {
      // Log the error for debugging
      console.error('Database error in querymatch:', err);
      return callback({ message: 'An error occurred while checking card existence.', error: err }, null);
    }

    if (results.length > 0) {
      // Card is already registered, return an error message
      return callback(null, { message: 'Card already registered' });
    }

    // Step 4: Check if email already exists in the database
    const emailCheckQuery = 'SELECT * FROM tbl_cards WHERE email = ?';
    global.db.query(emailCheckQuery, [Email], (err, emailResults) => {
      if (err) {
        // Log the error for debugging
        console.error('Database error in email check:', err);
        return callback({ message: 'An error occurred while checking email uniqueness.', error: err }, null);
      }

      if (emailResults.length > 0) {
        // Email is already registered, return an error message
        return callback(null, { message: 'Email already registered' });
      }

      // Step 5: Insert sanitized and validated data into the database
      const query = 'INSERT INTO tbl_cards (firstName, lastName, contact, Address, email, cardHolderName, cardNo, expiryDate, cvvCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      global.db.query(query, [firstName, lastName, contact, Address, Email, cardHolderName, cardNo, expiryDate, cvvCode], (err, results) => {
        if (err) {
          // Log the error for debugging
          console.error('Database error in inserting card details:', err);
          return callback({ message: 'An error occurred while registering the card.', error: err }, null);
        }

        // Card registered successfully, return the results
        callback(null, results);
      });
    });
  });
};




// Function to get all credit card details
const getAllCreditCards = (callback) => {
const query = 'SELECT * FROM tbl_cards order by id DESC';
global.db.query(query, (err, results) => {
  if (err) {
    // Log the error for debugging
    console.error('Database error in getAllCreditCards:', err);
    return callback({ message: 'An error occurred while fetching credit card details.', error: err }, null);
  }
  callback(null, results);
});
};

// Function to get a specific credit card by ID
const getCreditCardById = (id, callback) => {
const query = 'SELECT * FROM tbl_cards WHERE id = ?';
global.db.query(query, [id], (err, results) => {
  if (err) {
    // Log the error for debugging
    console.error('Database error in getCreditCardById:', err);
    return callback({ message: 'An error occurred while fetching credit card by ID.', error: err }, null);
  }
  callback(null, results[0]);  // We only need the first result as ID is unique
});
};

module.exports = {
createCreditCard,
getAllCreditCards,
getCreditCardById,
};
