const router = require('express').Router();
const { Blog, User } = require('../models');
const { tokenExtractor, userExtractor } = require('../utils/middleware');
const { Op } = require('sequelize');

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    include: {
      model: User,
      attributes: ['id', 'username', 'name']
    },
    where: {
      [Op.or]: [
        { title: { [Op.substring]: req.query.search ? req.query.search : '' } },
        { author: { [Op.substring]: req.query.search ? req.query.search : '' } }
      ]
    },
    order: [['likes', 'DESC']]
  });
  res.json(blogs)
});

router.post('/', tokenExtractor, userExtractor, async (req, res) => {
  const { title, author, url, likes, year } = req.body

  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required' })
  }

  try {
    const newBlog = await Blog.create({
      title,
      author,
      url,
      likes: likes || 0,
      year,
      userId: req.user.id
    })
    res.status(201).json(newBlog)
  } catch(error) {
    return res.status(400).json({ error })
  }
});

router.delete('/:id', tokenExtractor, userExtractor, async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    if (blog.userId !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to delete this blog' });
    }

    await blog.destroy();
    res.status(204).end();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'Something went wrong' });
  }
});

router.put('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);

  if (blog) {
    const { likes } = req.body
    blog.likes = typeof likes !== 'undefined' ? likes : blog.likes;
    await blog.save();
    res.json(blog);
  } else {
    res.status(404).json({ error: 'Blog not found' })
  }
});

module.exports = router;