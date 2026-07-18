const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { adminAuth } = require('../middleware/auth');

// GET all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.findAll({ where: { isActive: true }, order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']] });
    res.json(services);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET all services (admin)
router.get('/admin', adminAuth, async (req, res) => {
  try {
    const services = await Service.findAll({ order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']] });
    res.json(services);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET single service
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: 'Layanan tidak ditemukan' });
    res.json(service);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// CREATE service
router.post('/', adminAuth, async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// UPDATE service
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: 'Layanan tidak ditemukan' });
    await service.update(req.body);
    res.json(service);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// DELETE service
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: 'Layanan tidak ditemukan' });
    await service.destroy();
    res.json({ message: 'Layanan berhasil dihapus' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
