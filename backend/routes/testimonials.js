const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const { adminAuth } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({ where: { isActive: true }, order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']] });
    res.json(testimonials);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/admin', adminAuth, async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({ order: [['createdAt', 'DESC']] });
    res.json(testimonials);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', adminAuth, async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json(testimonial);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);
    if (!testimonial) return res.status(404).json({ error: 'Testimoni tidak ditemukan' });
    await testimonial.update(req.body);
    res.json(testimonial);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);
    if (!testimonial) return res.status(404).json({ error: 'Testimoni tidak ditemukan' });
    await testimonial.destroy();
    res.json({ message: 'Testimoni berhasil dihapus' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
