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

  try {
    const user = await User.findByPk(userId, {
      include: {
        model: Blog,
        as: 'readingBlogs',
        through: {
          attributes: [],
        },
        attributes: ['id', 'author', 'url', 'title', 'likes', 'year']
      },
    });

    if (user) {
      res.json({
        name: user.name,
        username: user.username,
        readings: user.readingBlogs,
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
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