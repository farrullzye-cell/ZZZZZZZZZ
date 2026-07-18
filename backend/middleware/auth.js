const jwt = require('jsonwebtoken');
require('dotenv').config();

const adminAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Akses ditolak. Silakan login terlebih dahulu.' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
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
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token tidak valid.' });
  }
};

const optionalAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (token) {
    try { req.user = jwt.verify(token, process.env.JWT_SECRET); } catch (e) {}
  }
  next();
};

module.exports = { adminAuth, customerAuth, optionalAuth };
