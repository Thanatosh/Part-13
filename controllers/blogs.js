const router = require('express').Router()
const jwt = require('jsonwebtoken');
const { Blog, User } = require('../models')
const { SECRET } = require('../util/config');

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch (error){
      console.log(error)
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
};

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    include: {
      model: User,
      attributes: ['id', 'username', 'name']
    },
  });
  res.json(blogs)
});

router.post('/', tokenExtractor, async (req, res) => {
  const { title, author, url, likes } = req.body

  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required' })
  }

  try {
    const user = await User.findByPk(req.decodedToken.id)
    const newBlog = await Blog.create({
      title,
      author,
      url,
      likes: likes || 0,
      userId: user.id
    })
    res.status(201).json(newBlog)
  } catch(error) {
    return res.status(400).json({ error })
  }
});

router.delete('/:id', tokenExtractor, async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    if (blog.userId !== req.decodedToken.id) {
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