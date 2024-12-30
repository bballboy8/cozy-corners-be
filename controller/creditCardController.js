// controller/creditCardController.js
if (!process.env.STRIPE_SANDBOX) {
  throw new Error("key is not defined.");
}

const stripe = require('stripe')(process.env.STRIPE_SANDBOX);


const { createCreditCard, getAllCreditCards, getCreditCardById } = require('../models/creditCardModel');

// Register a new credit card

exports.registerCreditCard = (req, res) => {
    const { firstName, lastName,contact, Address,email, cardHolderName, cardNo, expiryDate, cvvCode } = req.body;
    // Validate input
    if (!firstName || !lastName || !contact || !Address || !email || !cardHolderName || !cardNo || !expiryDate || !cvvCode) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    // Register the credit card
    createCreditCard(firstName, lastName,contact, Address,email, cardHolderName, cardNo, expiryDate, cvvCode, (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Server error', error: err });
      }
  
      if (result && result.message) {
        return res.status(200).json({ message: result.message });
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


exports.chargePayment = async (req, res) => {
  const { nameOnCard, email, cardNumber, expirationDate, cvv, amount,paymentOption } = req.body;

  if ( !amount || !nameOnCard || !email || !cardNumber || !expirationDate || !amount || !cvv || !paymentOption) {
    return res.status(400).json({ message: ' All fields is required' });
  }

  try {
    if(paymentOption=='hold'){
      res.json({ message:'payment is on hold' });
    }else{
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'], // Specify the allowed payment methods
        line_items: [
          {
            price_data: {
              currency: 'usd', // Set the currency
              product_data: {
                name: 'Cozy Corner Charges', // Name of the product
              },
              unit_amount: amount*100, // Price of the product in cents (e.g., $20.00)
            },
            quantity: 1, // Quantity of the item
          },
        ],
        mode: 'payment', // Set the payment mode (can be 'payment' or 'subscription')
        success_url: 'http://localhost:3000/dashbaord', // Redirect to this URL after successful payment
        cancel_url: 'http://localhost:3000/login', // Redirect to this URL if the user cancels
      });
      // Send the session ID to the frontend
      res.json({ id: session.id, url: session.url });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};





