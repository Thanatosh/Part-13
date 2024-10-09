const router = require('express').Router();
const { ReadingList } = require('../models');

router.post('/', async (req, res) => {
  const { blog_id, user_id } = req.body;

  try {
    const readingListEntry = await ReadingList.create({ blog_id, user_id });
    res.status(201).json(readingListEntry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
