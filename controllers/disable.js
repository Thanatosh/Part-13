const router = require('express').Router();
const { User } = require('../models');

router.put('/:id/disable', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.disabled) {
      return res.status(400).json({ error: 'User is already disabled' });
    }

    user.disabled = true;
    await user.save();

    res.status(200).json({ message: 'User account disabled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
