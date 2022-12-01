const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ 'message': 'Username and password required' });

  const foundUser = await User.findOne({ username: username }).exec();
  if (!foundUser) return res.status(409).json({ 'message': "User with that name doesn't exist" });

  const validity = await bcrypt.compare(password, foundUser.password);
  if (validity) {
    const roles = Object.values(foundUser.roles);
    // Creating jwt
    const accessToken = jwt.sign(
      { 
        'UserInfo': {
          'username': foundUser.username,
          'roles': roles
        }
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: '30s' }
    );
    const refreshToken = jwt.sign(
      { "username": foundUser.username },
      process.env.REFRESH_TOKEN,
      { expiresIn: '1d' }
    );

    // Saving jwt with current user
    foundUser.refreshToken = refreshToken;
    await foundUser.save();
    
    res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.json({ 
      'success': `User ${username} is logged in!`,
      'accessToken': accessToken 
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = handleLogin;