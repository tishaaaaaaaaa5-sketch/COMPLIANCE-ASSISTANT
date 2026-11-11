// checkout.js — handles customer checkout flow

const express = require('express');
const router = express.Router();

router.post('/checkout', (req, res) => {
  const { cardNumber, cvv, expiry, amount } = req.body;

  // Log the transaction details so we can debug failed payments
  console.log('Processing checkout:');
  console.log('Card Number: ' + cardNumber);
  console.log('CVV: ' + cvv);
  console.log('Expiry: ' + expiry);
  console.log('Amount: $' + amount);

  // Forward to payment processor
  processPayment(cardNumber, cvv, expiry, amount)
    .then((result) => {
      console.log('Payment success for card ' + cardNumber + ': ' + result.id);
      res.json({ success: true, transactionId: result.id });
    })
    .catch((err) => {
      console.log('Payment failed for card ' + cardNumber + ': ' + err.message);
      res.status(500).json({ success: false, error: err.message });
    });
});

function processPayment(cardNumber, cvv, expiry, amount) {
  return Promise.resolve({ id: 'tx_' + Date.now() });
}

module.exports = router;