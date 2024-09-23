require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const express = require('express');
const app = express();

const sequelize = new Sequelize(process.env.DATABASE_URL);

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
  }
}, {
  timestamps: false
});

app.use(express.json());

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
});

app.post('/api/blogs', async (req, res) => {
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

app.delete('/api/blogs/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)

  if (blog) {
    await blog.destroy()
    res.status(204).end()
  } else {
    res.status(404).json({ error: 'Blog not found' })
  }
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});