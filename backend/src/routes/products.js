const express = require('express');
const { products } = require('../data/products');

const router = express.Router();

// GET /products
router.get('/', (_req, res) => {
  res.json(products);
});

module.exports = router;
