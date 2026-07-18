const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/database');

// Import models
const Service = require('./models/Service');
const Portfolio = require('./models/Portfolio');
const Pricing = require('./models/Pricing');
const Testimonial = require('./models/Testimonial');
const Faq = require('./models/Faq');
const Order = require('./models/Order');
const Customer = require('./models/Customer');
const Blog = require('./models/Blog');
const Setting = require('./models/Setting');

const app = express();
const PORT = process.env.PORT || 5000;

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Terlalu banyak request, silakan coba lagi nanti.' },
});
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(express.static(path.join(__dirname, '..')));

// API Routes
app.use('/api/services', require('./routes/services'));
app.use('/api/portfolios', require('./routes/portfolios'));
app.use('/api/pricings', require('./routes/pricings'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/faqs', require('./routes/faqs'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/settings', require('./routes/settings'));

// API Info
app.get('/api', (req, res) => {
  res.json({
    name: 'Rullzye Store API',
    version: '1.0.0',
    endpoints: [
      '/api/services', '/api/portfolios', '/api/pricings',
      '/api/testimonials', '/api/faqs', '/api/orders',
      '/api/customers', '/api/blogs', '/api/auth', '/api/settings',
    ],
  });
});

// Serve index.html for all other routes (SPA fallback)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Endpoint tidak ditemukan' });
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Terjadi kesalahan server' });
});

// Start server
async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });
    console.log('Models synchronized.');

    // Create default admin if not exists
    const settingCount = await Setting.count();
    if (settingCount === 0) {
      await Setting.bulkCreate([
        { key: 'site_name', value: 'Rullzye Store Web Development', group: 'general' },
        { key: 'site_tagline', value: 'Kami membantu bisnis berkembang melalui website modern, cepat, aman, dan profesional.', group: 'general' },
        { key: 'wa_number', value: '628XXX', group: 'contact' },
        { key: 'admin_email', value: process.env.ADMIN_EMAIL || 'admin@rullzyestore.com', group: 'general' },
      ]);
      console.log('Default settings created.');
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Rullzye Store API running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
