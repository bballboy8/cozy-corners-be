// controller/creditCardController.js

const { createCreditCard, getAllCreditCards, getCreditCardById } = require('../models/creditCardModel');

// Register a new credit card

exports.registerCreditCard = (req, res) => {
    const { firstName, lastName,contact, Address, cardHolderName, cardNo, expiryDate, cvvCode } = req.body;
  
    // Validate input
    if (!firstName || !lastName || !contact || !Address || !cardHolderName || !cardNo || !expiryDate || !cvvCode) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    // Register the credit card
    createCreditCard(firstName, lastName,contact, Address, cardHolderName, cardNo, expiryDate, cvvCode, (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Server error', error: err });
      }
  
      if (result && result.message) {
        return res.status(400).json({ message: result.message });
      }
  
      // Card registered successfully
      res.status(201).json({ message: 'Credit card registered successfully', cardId: result.insertId });
    });
  };

// Get all credit cards (open, no authentication needed)
exports.getAllCreditCards = (req, res) => {
  getAllCreditCards((err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Server Error' });
    }

    res.status(200).json({ cards: results });
  });
};

// Get a specific credit card by ID (authentication required)
exports.getCreditCardById = (req, res) => {
  const cardId = req.params.id;

  // Ensure user is authenticated and the card belongs to them
  getCreditCardById(cardId, (err, card) => {
    if (err || !card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // // Optionally, check if the card belongs to the authenticated user
    // if (!req.user) {
    //   return res.status(403).json({ message: 'Access denied' });
    // }

    res.status(200).json({ card });
  });
};