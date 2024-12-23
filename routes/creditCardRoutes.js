// routes/creditCardRoutes.js

const express = require('express');
const helmet = require('helmet');

const router = express.Router();
const { registerCreditCard, getAllCreditCards, getCreditCardById,chargePayment } = require('../controller/creditCardController');
const authenticate = require('../middleware/authenticate'); // Assuming you have an authentication middleware

router.use(helmet());
// Register a new credit card
router.post('/register', registerCreditCard);

// Get all credit card details (open API, no token needed)
router.get('/all',authenticate, getAllCreditCards);

// Get a specific credit card by ID (requires token)
router.get('/:id',authenticate, getCreditCardById);

router.post('/charge-payment',authenticate, chargePayment);

module.exports = router;
