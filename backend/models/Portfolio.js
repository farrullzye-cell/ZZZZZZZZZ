const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Portfolio = sequelize.define('Portfolio', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  category: { type: DataTypes.STRING(100), allowNull: true },
  client: { type: DataTypes.STRING(200), allowNull: true },
  thumbnail: { type: DataTypes.TEXT, allowNull: true },
  linkPreview: { type: DataTypes.TEXT, allowNull: true },
  linkDetail: { type: DataTypes.TEXT, allowNull: true },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: 'portfolios',
  timestamps: true,
});

module.exports = Portfolio;
