const jwt = require('jsonwebtoken');
const { User, Token, Session } = require('../models');
const { SECRET } = require('../util/config');

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7);

    console.log("Received token:", token);

    try {
      const decodedToken = jwt.verify(token, SECRET);
      if (!decodedToken.id) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const session = await Session.findOne({ where: { token } });
      if (!session) {
        return res.status(401).json({ error: 'Invalid or expired session' });
      }

      console.log("Decoded token:", decodedToken);

      const storedToken = await Token.findOne({ where: { token: token, user_id: decodedToken.id } });
      
      console.log("Stored token from DB:", storedToken ? storedToken.token : 'No token found');

      if (!storedToken) {
        return res.status(401).json({ error: 'Token expired or invalid' });
      }

      req.token = decodedToken;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }
      return res.status(401).json({ error: 'Invalid token' });
    }
  } else {
    return res.status(401).json({ error: 'Token missing' });
  }
  next();
};

const userExtractor = async (req, res, next) => {
  if (req.token) {
    try {
      const user = await User.findByPk(req.token.id);

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      if (user.disabled) {
        return res.status(403).json({ error: 'User account is disabled' });
      }

      req.user = user;
    } catch (error) {
      return res.status(500).json({ error: 'Server error when fetching user' });
    }
  }
  next();
};

module.exports = { tokenExtractor, userExtractor };
