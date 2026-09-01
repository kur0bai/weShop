/**
 * users.js
 * -----------------------------------------------------------------------
 * Usuarios de prueba para el lab. La app cliente (ver
 * vulnstore-expo/src/utils/crypto.ts -> weakHashPassword) manda la
 * contraseña ya hasheada con MD5 sin salt — el backend simplemente
 * compara ese hash contra el guardado acá. Esto es intencional para que
 * el flujo end-to-end reproduzca la vulnerabilidad CRYPTO-1 del cliente;
 * en un backend real la contraseña debería llegar en claro por TLS y
 * hashearse server-side con bcrypt/argon2.
 * -----------------------------------------------------------------------
 */
const crypto = require('crypto');

function md5(value) {
  return crypto.createHash('md5').update(value).digest('hex');
}

const users = [
  {
    id: 'u1',
    email: 'cliente@vulnstore.test',
    passwordMd5: md5('cliente123'),
    role: 'customer',
  },
  {
    id: 'u2',
    email: 'admin@vulnstore.test',
    passwordMd5: md5('admin123'),
    role: 'admin',
  },
];

function findByEmail(email) {
  return users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
}

module.exports = { users, findByEmail };
