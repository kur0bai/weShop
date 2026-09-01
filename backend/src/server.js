require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { requireApiKey } = require('./middleware/apiKey');
const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const checkoutRoutes = require('./routes/checkout');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Todos los endpoints de negocio requieren el X-Api-Key que el cliente
// manda hardcodeado (ver docs/VULNERABILITIES.md del proyecto de la app).
app.use('/auth', requireApiKey, authRoutes);
app.use('/products', requireApiKey, productsRoutes);
app.use('/checkout', requireApiKey, checkoutRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`VulnStore backend listening on port ${PORT}`);
});
