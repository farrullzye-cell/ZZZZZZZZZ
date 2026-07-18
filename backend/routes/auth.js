const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
require('dotenv').config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@rullzyestore.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

router.post('/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = generateToken({ id: 'admin', email, role: 'admin' });
    return res.json({ token, user: { id: 'admin', email, name: 'Admin', role: 'admin' } });
  }
  res.status(401).json({ error: 'Email atau password salah' });
});

router.post('/customer/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ where: { email } });
    if (!customer) return res.status(401).json({ error: 'Email atau password salah' });
    const valid = await customer.comparePassword(password);
    if (!valid) return res.status(401).json({ error: 'Email atau password salah' });
    const token = generateToken({ id: customer.id, email: customer.email, role: 'customer' });
    const { password: _, ...userData } = customer.toJSON();
    res.json({ token, user: userData });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/customer/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const exists = await Customer.findOne({ where: { email } });
    if (exists) return res.status(400).json({ error: 'Email sudah terdaftar' });
    const customer = await Customer.create({ name, email, phone, password });
    const token = generateToken({ id: customer.id, email: customer.email, role: 'customer' });
    const { password: _, ...userData } = customer.toJSON();
    res.status(201).json({ token, user: userData });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;
