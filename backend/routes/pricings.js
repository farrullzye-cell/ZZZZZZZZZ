const express = require('express');
const router = express.Router();
const Pricing = require('../models/Pricing');
const { adminAuth } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const pricings = await Pricing.findAll({ where: { isActive: true }, order: [['sortOrder', 'ASC']] });
    res.json(pricings);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/admin', adminAuth, async (req, res) => {
  try {
    const pricings = await Pricing.findAll({ order: [['sortOrder', 'ASC']] });
    res.json(pricings);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', adminAuth, async (req, res) => {
  try {
    const pricing = await Pricing.create(req.body);
    res.status(201).json(pricing);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const pricing = await Pricing.findByPk(req.params.id);
    if (!pricing) return res.status(404).json({ error: 'Paket harga tidak ditemukan' });
    await pricing.update(req.body);
    res.json(pricing);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const pricing = await Pricing.findByPk(req.params.id);
    if (!pricing) return res.status(404).json({ error: 'Paket harga tidak ditemukan' });
    await pricing.destroy();
    res.json({ message: 'Paket harga berhasil dihapus' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
