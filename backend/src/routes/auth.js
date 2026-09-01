const express = require('express');
const jwt = require('jsonwebtoken');
const { findByEmail } = require('../data/users');

const router = express.Router();

// Fallback del secret si no existe un archivo .env en el laboratorio
const JWT_SECRET = process.env.JWT_SECRET || 'vulnstore_lab_secret_key_123';

router.post('/login', (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const user = findByEmail(email);

  // VULNERABILIDAD SEMBRADA: Comparación en texto plano de MD5 sin salt
  if (!user || user.passwordMd5 !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Firmado del JWT (Vulnerable si el algoritmo no se fuerza o se firma con clave débil)
  const token = jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
});

module.exports = router;