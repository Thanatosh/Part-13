const router = require('express').Router();
const { ReadingList } = require('../models');
const { tokenExtractor, userExtractor } = require('../utils/middleware');

router.post('/', async (req, res) => {
  const { blog_id, user_id } = req.body;

  try {
    const readingListEntry = await ReadingList.create({ blog_id, user_id });
    res.status(201).json(readingListEntry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', tokenExtractor, userExtractor, async (req, res) => {
  const readingListId = req.params.id;
  const { read } = req.body;
  const userId = req.user.id;

  try {
    const readingListEntry = await ReadingList.findByPk(readingListId);

    if (!readingListEntry) {
      return res.status(404).json({ error: 'Reading list entry not found' });
    }

    if (readingListEntry.user_id !== userId) {
      return res.status(403).json({ error: 'You can only mark your own reading list entries' });
    }

    readingListEntry.read = read;
    await readingListEntry.save();

    return res.status(200).json(readingListEntry);
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
