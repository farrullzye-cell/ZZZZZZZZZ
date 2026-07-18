const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { adminAuth } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
}

router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.findAll({ where: { isPublished: true }, order: [['publishedAt', 'DESC']], limit: 20 });
    res.json(blogs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/admin', adminAuth, async (req, res) => {
  try {
    const blogs = await Blog.findAll({ order: [['createdAt', 'DESC']] });
    res.json(blogs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ where: { slug: req.params.slug } });
    if (!blog) return res.status(404).json({ error: 'Artikel tidak ditemukan' });
    res.json(blog);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', adminAuth, async (req, res) => {
  try {
    const data = { ...req.body, slug: generateSlug(req.body.title) };
    if (data.isPublished && !data.publishedAt) data.publishedAt = new Date();
    const blog = await Blog.create(data);
    res.status(201).json(blog);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Artikel tidak ditemukan' });
    const data = req.body;
    if (data.isPublished && !blog.publishedAt) data.publishedAt = new Date();
    await blog.update(data);
    res.json(blog);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Artikel tidak ditemukan' });
    await blog.destroy();
    res.json({ message: 'Artikel berhasil dihapus' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
