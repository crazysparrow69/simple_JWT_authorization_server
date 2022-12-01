const Nuke = require('../models/Nuke');

const getAllKeys = async (req, res) => {
  res.json([await Nuke.findById('6388965bdd27f8504a03d829'), await Nuke.findById('638896c7dd27f8504a03d82a')]);
};

module.exports = getAllKeys;