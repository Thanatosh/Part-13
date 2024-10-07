const { DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  underscored: true,
  timestamps: true,
});

module.exports = User;