const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: 'Validation error' });
  }

  if (error.name === 'SequelizeDatabaseError') {
    return res.status(500).json({ error: 'Database error' });
  }

  res.status(500).json({ error: 'An unexpected error occurred' });
};

module.exports = errorHandler;
