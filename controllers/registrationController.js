const bcrypt = require('bcrypt');
const User = require('../models/User');

const handleRegistration = async (req, res) => {
  const { username, password } = req.body; 
  if (!username || !password) return res.status(400).json({ 'message': 'Username and password required' });

  const duplicate = await User.findOne({ username: username }).exec();
  if (duplicate) return res.status(409).json({ 'message': 'User with that name already exists' });

  try {
    const result = await User.create({
      'username': username,
      'password': await bcrypt.hash(password, 10)
    });

    console.log(result);

    res.status(201).json({ "message": "User has been created" });
  } catch (err) {
    res.sendStatus(401);
  }
};

module.exports = handleRegistration;