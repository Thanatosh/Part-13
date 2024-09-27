const router = require('express').Router();

const { User } = require('../models');

router.get('/', async (req, res) => {
  const users = await User.findAll()
  res.json(users)
});

router.post('/', async (req, res) => {
  const { username, name } = req.body;

  if (!username || !name) {
    return res.status(400).json({ error: 'Username and name are required' });
  }

  try {
    const user = await User.create({ username, name });
    res.status(201).json(user);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Username must be unique' });
    }
    return res.status(500).json({ error: 'An error occurred' });
  }
});


router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
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