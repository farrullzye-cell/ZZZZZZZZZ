const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const { adminAuth } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const settings = await Setting.findAll();
    const map = {};
    settings.forEach(s => { map[s.key] = s.value; });
    res.json(map);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:key', adminAuth, async (req, res) => {
  try {
    const [setting, created] = await Setting.upsert({ key: req.params.key, value: req.body.value, group: req.body.group });
    res.json(setting);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;
