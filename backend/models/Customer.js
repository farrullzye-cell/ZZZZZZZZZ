const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const Customer = sequelize.define('Customer', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING(200), allowNull: false },
  email: { type: DataTypes.STRING(200), allowNull: false, unique: true },
  phone: { type: DataTypes.STRING(50), allowNull: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  avatar: { type: DataTypes.TEXT, allowNull: true },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'customers',
  timestamps: true,
  hooks: {
    beforeCreate: async (customer) => {
      customer.password = await bcrypt.hash(customer.password, 10);
    },
  },
});

Customer.prototype.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = Customer;
