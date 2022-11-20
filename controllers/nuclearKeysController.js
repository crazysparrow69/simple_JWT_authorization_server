const data = {
  nuclearKeys: require('../models/nuclear_keys.json'),
};

const getAllKeys = (req, res) => {
  res.json(data.nuclearKeys);
};

module.exports = getAllKeys;