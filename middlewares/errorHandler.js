const errorHandler = (error, req, res, next) => {
  console.error('Error:', error);

  if (error.name === 'SequelizeValidationError') {
    const validationErrors = error.errors.map(err => err.message);
    return res.status(400).json({ error: validationErrors });
  }

  if (error.name === 'SequelizeDatabaseError') {
    return res.status(500).json({ error: 'Database error' });
  }

  res.status(500).json({ error: 'An unexpected error occurred' });
};

module.exports = errorHandler;
