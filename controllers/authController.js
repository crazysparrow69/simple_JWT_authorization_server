const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const usersDB = {
  users: require('../models/usersDB.json'),
  setUsers: function (data) { this.users = data }
};

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ 'message': 'Username and password required' });

  const foundUser = usersDB.users.find(person => person.username === username);
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
    const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
    const authUser = { ...foundUser, refreshToken };
    usersDB.setUsers([ ...otherUsers, authUser ]);

    await fsPromises.writeFile(
      path.join(__dirname, '..', 'models', 'usersDB.json'),
      JSON.stringify(usersDB.users)
    );
    
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