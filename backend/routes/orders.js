const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { adminAuth, customerAuth } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

function generateOrderNumber() {
  const date = new Date();
  return `RS-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
}

router.get('/', adminAuth, async (req, res) => {
  try {
    const orders = await Order.findAll({ order: [['createdAt', 'DESC']] });
    res.json(orders);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/my-orders', customerAuth, async (req, res) => {
  try {
    const orders = await Order.findAll({ where: { customerId: req.user.id }, order: [['createdAt', 'DESC']] });
    res.json(orders);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/stats', adminAuth, async (req, res) => {
  try {
    const all = await Order.count();
    const pending = await Order.count({ where: { status: 'pending' } });
    const processing = await Order.count({ where: { status: 'processing' } });
    const completed = await Order.count({ where: { status: 'completed' } });
    res.json({ all, pending, processing, completed });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
    res.json(order);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const orderData = { ...req.body, orderNumber: generateOrderNumber() };
    const order = await Order.create(orderData);
    res.status(201).json(order);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
    await order.update(req.body);
    res.json(order);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
    await order.destroy();
    res.json({ message: 'Pesanan berhasil dihapus' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
