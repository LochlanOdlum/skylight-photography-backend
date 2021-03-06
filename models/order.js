const { DataTypes } = require('sequelize');

const sequelize = require('../util/database');

const Order = sequelize.define('order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  paymentIntentId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalPriceInPence: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isPaymentCompleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Order;
