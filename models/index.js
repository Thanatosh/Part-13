const Blog = require('./blog');
const User = require('./user');
const ReadingList = require('./readinglist');

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: ReadingList, as: 'readingBlogs', foreignKey: 'user_id' });
Blog.belongsToMany(User, { through: ReadingList, as: 'readByUsers', foreignKey: 'blog_id' });

module.exports = {
  Blog,
  User,
  ReadingList,
};