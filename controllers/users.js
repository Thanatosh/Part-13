const router = require('express').Router();
const { User, Blog } = require('../models');

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: ['id', 'title', 'author', 'url', 'likes']
    },
  });
  res.json(users)
});

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    console.log('User created:', user);
    res.json(user);
  } catch (error) {
    console.log('Validation error:', error);
    return res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  const readStatus = req.query.read;

  try {
    const user = await User.findByPk(userId, {
      include: {
        model: Blog,
        as: 'readingBlogs',
        attributes: ['id', 'author', 'url', 'title', 'likes', 'year'],
        through: {
          attributes: ['id', 'read'],
        }
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const formattedReadings = user.readingBlogs.map(blog => ({
      id: blog.id,
      url: blog.url,
      title: blog.title,
      author: blog.author,
      likes: blog.likes,
      year: blog.year,
      readinglists: blog.reading_list ? [{
        read: blog.reading_list.read,
        id: blog.reading_list.id
      }] : []
    }));

    let filteredReadings = formattedReadings;

    if (readStatus === 'true') {
      filteredReadings = formattedReadings.filter(blog =>
        blog.readinglists.some(list => list.read === true)
      );
    } else if (readStatus === 'false') {
      filteredReadings = formattedReadings.filter(blog =>
        blog.readinglists.some(list => list.read === false)
      );
    }

    res.json({
      name: user.name,
      username: user.username,
      readings: filteredReadings,
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.put('/:username', async (req, res) => {
  const { username } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.name = name;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating user' });
  }
});

module.exports = router;