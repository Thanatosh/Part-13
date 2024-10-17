const Blog = require('./blog');
const User = require('./user');
const ReadingList = require('./readinglist');
const Token = require('./token');
const Session = require('./session');

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: ReadingList, as: 'readingBlogs', foreignKey: 'user_id' });
Blog.belongsToMany(User, { through: ReadingList, as: 'readByUsers', foreignKey: 'blog_id' });
Session.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  Blog,
  User,
  ReadingList,
  Token,
  Session,
};