const express = require('express');
const jwt = require('jsonwebtoken');
const { findByEmail } = require('../data/users');

const router = express.Router();

// POST /auth/login
// Body: { email, password } — el cliente ya envía "password" hasheado con
// MD5 (ver docs/VULNERABILITIES.md #3 en el proyecto de la app).
router.post('/login', (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const user = findByEmail(email);
  if (!user || user.passwordMd5 !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.json({ token });
});

module.exports = router;
