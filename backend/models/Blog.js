const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Blog = sequelize.define('Blog', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING(300), allowNull: false },
  slug: { type: DataTypes.STRING(300), allowNull: false, unique: true },
  excerpt: { type: DataTypes.TEXT, allowNull: true },
  content: { type: DataTypes.TEXT, allowNull: true },
  thumbnail: { type: DataTypes.TEXT, allowNull: true },
  author: { type: DataTypes.STRING(100), defaultValue: 'Admin' },
  category: { type: DataTypes.STRING(100), allowNull: true },
  tags: { type: DataTypes.JSONB, defaultValue: [] },
  isPublished: { type: DataTypes.BOOLEAN, defaultValue: false },
  publishedAt: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'blogs',
  timestamps: true,
});

module.exports = Blog;
