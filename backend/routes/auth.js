const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
require('dotenv').config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@rullzyestore.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

function generateToken(payload) {
  const secret = process.env.JWT_SECRET || 'rullzye-store-default-secret-key';
  return jwt.sign(payload, secret, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

router.post('/admin/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email dan password wajib diisi' });
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = generateToken({ id: 'admin', email, role: 'admin' });
      return res.json({ token, user: { id: 'admin', email, name: 'Admin', role: 'admin' } });
    }
    res.status(401).json({ error: 'Email atau password salah' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan server', detail: err.message });
  }
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
