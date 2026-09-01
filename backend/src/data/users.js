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
