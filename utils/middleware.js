const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { SECRET } = require('../util/config');

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch (error) {
      console.log(error);
      return res.status(401).json({ error: 'token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }
  next();
};

const userExtractor = async (req, res, next) => {
  if (req.decodedToken) {
    try {
      req.user = await User.findByPk(req.decodedToken.id);
      if (!req.user) {
        return res.status(401).json({ error: 'user not found' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'server error when fetching user' });
    }
  }
  next();
};

module.exports = { tokenExtractor, userExtractor };
