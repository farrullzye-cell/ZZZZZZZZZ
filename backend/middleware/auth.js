const jwt = require('jsonwebtoken');
require('dotenv').config();

const adminAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Akses ditolak. Silakan login terlebih dahulu.' });

  try {
    const secret = process.env.JWT_SECRET || 'rullzye-store-default-secret-key';
    const verified = jwt.verify(token, secret);
    if (verified.role !== 'admin') return res.status(403).json({ error: 'Akses khusus admin.' });
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token tidak valid.' });
  }
};

const customerAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Akses ditolak. Silakan login terlebih dahulu.' });

  try {
    const secret = process.env.JWT_SECRET || 'rullzye-store-default-secret-key';
    const verified = jwt.verify(token, secret);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token tidak valid.' });
  }
};

const optionalAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (token) {
    try {
      const secret = process.env.JWT_SECRET || 'rullzye-store-default-secret-key';
      req.user = jwt.verify(token, secret);
    } catch (e) {}
  }
  next();
};

module.exports = { adminAuth, customerAuth, optionalAuth };
