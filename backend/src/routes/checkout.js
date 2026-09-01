const express = require('express');
const crypto = require('crypto');

const router = express.Router();

// POST /checkout
// Body: { cart: Product[], card: { number, cvv, expiry } }
router.post('/', (req, res) => {
  const { cart, card } = req.body ?? {};

  if (!Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: 'cart must be a non-empty array' });
  }
  if (!card?.number || !card?.cvv || !card?.expiry) {
    return res.status(400).json({ error: 'card details are required' });
  }

  // Mock: no se procesa pago real, solo se genera un id de orden.
  const orderId = crypto.randomUUID();
  res.status(201).json({ orderId });
});

module.exports = router;
