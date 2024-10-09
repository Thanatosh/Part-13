const { DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

const ReadingList = sequelize.define('reading_list', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  blog_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'blogs', key: 'id' },
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  underscored: true,
  timestamps: true,
});

module.exports = ReadingList;
