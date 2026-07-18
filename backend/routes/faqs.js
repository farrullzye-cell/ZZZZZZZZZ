const express = require('express');
const router = express.Router();
const Faq = require('../models/Faq');
const { adminAuth } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const faqs = await Faq.findAll({ where: { isActive: true }, order: [['sortOrder', 'ASC']] });
    res.json(faqs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/admin', adminAuth, async (req, res) => {
  try {
    const faqs = await Faq.findAll({ order: [['sortOrder', 'ASC']] });
    res.json(faqs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', adminAuth, async (req, res) => {
  try {
    const faq = await Faq.create(req.body);
    res.status(201).json(faq);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const faq = await Faq.findByPk(req.params.id);
    if (!faq) return res.status(404).json({ error: 'FAQ tidak ditemukan' });
    await faq.update(req.body);
    res.json(faq);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const faq = await Faq.findByPk(req.params.id);
    if (!faq) return res.status(404).json({ error: 'FAQ tidak ditemukan' });
    await faq.destroy();
    res.json({ message: 'FAQ berhasil dihapus' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
