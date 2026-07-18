const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Testimonial = sequelize.define('Testimonial', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING(200), allowNull: false },
  role: { type: DataTypes.STRING(200), allowNull: true },
  content: { type: DataTypes.TEXT, allowNull: false },
  avatar: { type: DataTypes.TEXT, allowNull: true },
  rating: { type: DataTypes.INTEGER, defaultValue: 5 },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: 'testimonials',
  timestamps: true,
});

module.exports = Testimonial;
