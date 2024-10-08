const Blog = require('./blog');
const User = require('./user');

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: 'reading_list', as: 'readingBlogs', foreignKey: 'user_id' });
Blog.belongsToMany(User, { through: 'reading_list', as: 'readByUsers', foreignKey: 'blog_id' });

module.exports = {
  Blog, 
  User
};