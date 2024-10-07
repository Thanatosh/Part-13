const { DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

const Blog = sequelize.define('blog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  author: {
    type: DataTypes.STRING
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: 1991,
        msg: 'Year must be 1991 or later.'
      },
      max: {
        args: new Date().getFullYear(),
        msg: `Year must not be later than ${new Date().getFullYear()}.`
      }
    }
  }
}, {
  underscored: true,
  timestamps: true,
});

module.exports = Blog;