const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  orderNumber: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  customerId: { type: DataTypes.UUID, allowNull: true },
  customerName: { type: DataTypes.STRING(200), allowNull: false },
  customerEmail: { type: DataTypes.STRING(200), allowNull: true },
  customerPhone: { type: DataTypes.STRING(50), allowNull: true },
  packageName: { type: DataTypes.STRING(100), allowNull: false },
  packagePrice: { type: DataTypes.STRING(50), allowNull: true },
  notes: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.ENUM('pending', 'consultation', 'processing', 'completed', 'cancelled'), defaultValue: 'pending' },
  progress: { type: DataTypes.INTEGER, defaultValue: 0 },
  paymentStatus: { type: DataTypes.ENUM('unpaid', 'dp', 'paid'), defaultValue: 'unpaid' },
  paymentMethod: { type: DataTypes.STRING(50), allowNull: true },
  totalAmount: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
}, {
  tableName: 'orders',
  timestamps: true,
});

module.exports = Order;
