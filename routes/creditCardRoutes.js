// routes/creditCardRoutes.js

const express = require('express');
const router = express.Router();
const { registerCreditCard, getAllCreditCards, getCreditCardById,chargePayment } = require('../controller/creditCardController');
const authenticate = require('../middleware/authenticate'); // Assuming you have an authentication middleware

// Register a new credit card
router.post('/register', registerCreditCard);

// Get all credit card details (open API, no token needed)
router.get('/all', getAllCreditCards);

// Get a specific credit card by ID (requires token)
router.get('/:id', getCreditCardById);

router.post('/charge-payment', chargePayment);

module.exports = router;
