// models/creditCardModel.js

const createCreditCard = (firstName, lastName, contact, Address, cardHolderName, cardNo, expiryDate, cvvCode, callback) => {
    // Check if the card already exists
    const querymatch = 'SELECT * FROM tbl_cards WHERE cardNo = ?';
    global.db.query(querymatch, [cardNo], (err, results) => {
      if (err) {
        return callback(err, null);  // Error in querying the database
      }
  
      if (results.length > 0) {
        // Card is already registered, return an error message
        return callback(null, { message: 'Card already registered' });
      }
  
      // Card is not registered, proceed with inserting it
      const query = 'INSERT INTO tbl_cards (firstName, lastName, contact, Address, cardHolderName, cardNo, expiryDate, cvvCode) VALUES (?, ?, ?, ?, ?, ?, ?,?)';
      global.db.query(query, [firstName, lastName,contact, Address, cardHolderName, cardNo, expiryDate, cvvCode], (err, results) => {
        if (err) {
          return callback(err, null);  // Error in inserting the card details
        }
        
        // Card registered successfully, return the results
        callback(null, results);
      });
    });
};

  
  // Function to get all credit card details
  const getAllCreditCards = (callback) => {
    const query = 'SELECT * FROM tbl_cards';
    global.db.query(query, (err, results) => {
      callback(err, results);
    });
  };
  
  // Function to get a specific credit card by ID
  const getCreditCardById = (id, callback) => {
    const query = 'SELECT * FROM tbl_cards WHERE id = ?';
    global.db.query(query, [id], (err, results) => {
      callback(err, results[0]);  // We only need the first result as ID is unique
    });
  };
  
  module.exports = {
    createCreditCard,
    getAllCreditCards,
    getCreditCardById,
  };
  