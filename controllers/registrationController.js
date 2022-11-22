const bcrypt = require('bcrypt');
const fsPromises = require('fs').promises;
const path = require('path');

const usersDB = {
  users: require('../models/usersDB.json'),
  setUsers: function (data) { this.users = data }
};

const handleRegistration = async (req, res) => {
  const { username, password } = req.body; 
  if (!username || !password) return res.status(400).json({ 'message': 'Username and password required' });

  const duplicate = usersDB.users.find(person => person.username === username);
  if (duplicate) return res.status(409).json({ 'message': 'User with that name already exists' });

  try {
    newUser = {
      'username': username,
      'roles': { 'User': 3010 },
      'password': await bcrypt.hash(password, 10)
    };

    fsPromises.writeFile(
      path.join(__dirname, '..', 'models', 'usersDB.json'),
      JSON.stringify([...usersDB.users, newUser ])
    );
  } catch (err) {
    res.sendStatus(401);
  }
  res.status(201).json({ "message": "User has been created" });
};

module.exports = handleRegistration;