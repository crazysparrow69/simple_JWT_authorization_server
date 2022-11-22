const fsPromises = require('fs').promises;
const path = require('path');

const usersDB = {
  users: require('../models/usersDB.json'),
  setUsers: function (data) { this.users = data }
};

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);

  const refreshToken = cookies.jwt;
  const foundUser = usersDB.users.filter(person => person.refreshToken === refreshToken);
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true });
    res.sendStatus(204);
  }
 
  const otherUsers = usersDB.users.filter(person => person.refreshToken !== refreshToken);
  const currentUser = {};
  currentUser.username = foundUser[0].username;
  currentUser.password = foundUser[0].password;
  currentUser.roles = foundUser[0].roles;
  usersDB.setUsers([ ...otherUsers, currentUser ]);

  await fsPromises.writeFile(
    path.join(__dirname, '..', 'models', 'usersDB.json'),
    JSON.stringify(usersDB.users)
  );

  res.clearCookie('jwt', { httpOnly: true });
  res.sendStatus(204);
};

module.exports = handleLogout;