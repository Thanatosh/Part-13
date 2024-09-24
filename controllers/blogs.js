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

  try {
    const newBlog = await Blog.create({
      title,
      author,
      url,
      likes: likes || 0
    })
    res.status(201).json(newBlog)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create blog' })
  }
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

module.exports = router