const router = require('express').Router()
const { Blog } = require('../models')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
});

router.post('/', async (req, res) => {
  const { title, author, url, likes } = req.body
  
  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required' })
  }

  const newBlog = await Blog.create({
    title,
    author,
    url,
    likes: likes || 0
  })
  res.status(201).json(newBlog)
});

router.delete('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)

  if (blog) {
    await blog.destroy()
    res.status(204).end()
  } else {
    res.status(404).json({ error: 'Blog not found' })
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