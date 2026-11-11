// payments.js — sends payment data to the payment processor

const axios = require('axios');

const PAYMENT_GATEWAY_URL = 'http://payments.acme-processor.com/api/v1/charge';

async function sendPayment(cardNumber, cvv, expiry, amount, currency) {
  const payload = {
    card_number: cardNumber,
    cvv: cvv,
    expiry: expiry,
    amount: amount,
    currency: currency,
  };

  const response = await axios.post(PAYMENT_GATEWAY_URL, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
}

async function refundPayment(transactionId, amount) {
  const url = 'http://payments.acme-processor.com/api/v1/refund';
  const response = await axios.post(url, { transactionId, amount });
  return response.data;
}

module.exports = { sendPayment, refundPayment };