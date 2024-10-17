const jwt = require('jsonwebtoken');
const router = require('express').Router();
const { SECRET } = require('../util/config');
const { User, Token, Session } = require('../models');

router.post('/', async (req, res) => {
  const body = req.body;

  const user = await User.findOne({
    where: { username: body.username },
  });

  console.log("User retrieved:", user);

  const passwordCorrect = body.password === 'salainen';

  if (!(user && passwordCorrect)) {
    return res.status(401).json({ error: 'invalid username or password' });
  }

  if (user.disabled) {
    return res.status(403).json({ error: 'User account is disabled' });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);

  console.log("Token creation attempt:", { token, userId: user.id });

  try {
    await Token.create({
      token: token,
      user_id: user.id,
    });

    await Session.create({
      user_id: user.id,
      token: token,
    });
  } catch (error) {
    console.error("Token creation error:", error);
    return res.status(500).json({ error: 'Failed to create token' });
  }

  res.status(200).send({
    token,
    username: user.username,
    name: user.name,
  });
});

module.exports = router;
