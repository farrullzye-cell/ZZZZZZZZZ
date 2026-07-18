const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const { adminAuth } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const where = { isActive: true };
    if (category && category !== 'all') where.category = category;
    const portfolios = await Portfolio.findAll({ where, order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']] });
    res.json(portfolios);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/admin', adminAuth, async (req, res) => {
  try {
    const portfolios = await Portfolio.findAll({ order: [['createdAt', 'DESC']] });
    res.json(portfolios);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findByPk(req.params.id);
    if (!portfolio) return res.status(404).json({ error: 'Portofolio tidak ditemukan' });
    res.json(portfolio);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', adminAuth, async (req, res) => {
  try {
    const portfolio = await Portfolio.create(req.body);
    res.status(201).json(portfolio);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findByPk(req.params.id);
    if (!portfolio) return res.status(404).json({ error: 'Portofolio tidak ditemukan' });
    await portfolio.update(req.body);
    res.json(portfolio);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findByPk(req.params.id);
    if (!portfolio) return res.status(404).json({ error: 'Portofolio tidak ditemukan' });
    await portfolio.destroy();
    res.json({ message: 'Portofolio berhasil dihapus' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
