const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const { adminAuth, customerAuth } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

router.get('/', adminAuth, async (req, res) => {
  try {
    const customers = await Customer.findAll({ attributes: { exclude: ['password'] }, order: [['createdAt', 'DESC']] });
    res.json(customers);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/profile', customerAuth, async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    if (!customer) return res.status(404).json({ error: 'Customer tidak ditemukan' });
    res.json(customer);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/profile', customerAuth, async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.user.id);
    if (!customer) return res.status(404).json({ error: 'Customer tidak ditemukan' });
    if (req.body.password) req.body.password = await bcrypt.hash(req.body.password, 10);
    await customer.update(req.body);
    const { password, ...data } = customer.toJSON();
    res.json(data);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer tidak ditemukan' });
    if (req.body.password) req.body.password = await bcrypt.hash(req.body.password, 10);
    await customer.update(req.body);
    const { password, ...data } = customer.toJSON();
    res.json(data);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer tidak ditemukan' });
    await customer.destroy();
    res.json({ message: 'Customer berhasil dihapus' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
