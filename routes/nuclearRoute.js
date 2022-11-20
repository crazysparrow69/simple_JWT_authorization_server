const express = require('express');
const router = express.Router();
const getAllKeys = require('../controllers/nuclearKeysController');

router.get('/', getAllKeys);

module.exports = router;