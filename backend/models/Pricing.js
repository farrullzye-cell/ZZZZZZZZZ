const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pricing = sequelize.define('Pricing', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  priceMonthly: { type: DataTypes.STRING(50), allowNull: true },
  priceAnnual: { type: DataTypes.STRING(50), allowNull: true },
  currency: { type: DataTypes.STRING(10), defaultValue: 'Rp' },
  period: { type: DataTypes.STRING(100), allowNull: true },
  isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
  popularLabel: { type: DataTypes.STRING(100), allowNull: true },
  buttonText: { type: DataTypes.STRING(100), defaultValue: 'Pilih Paket' },
  buttonLink: { type: DataTypes.TEXT, allowNull: true },
  features: { type: DataTypes.JSONB, defaultValue: [] },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: 'pricings',
  timestamps: true,
});

module.exports = Pricing;
