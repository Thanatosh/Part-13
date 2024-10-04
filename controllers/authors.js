const router = require('express').Router();
const { Blog } = require('../models');
const { sequelize } = require('../util/db')

router.get('/', async (req, res) => {
  try {
    const authors = await Blog.findAll({
      attributes: [
        'author',
        [sequelize.fn('COUNT', sequelize.col('id')), 'blogs'],
        [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
      ],
      group: ['author'],
      order: [[sequelize.fn('SUM', sequelize.col('likes')), 'DESC']]
    });

    res.json(authors);
  } catch (error) {
    console.error('Error fetching authors data:', error);
    res.status(500).json({ error: 'An error occurred while fetching authors data' });
  }
});

module.exports = router;
