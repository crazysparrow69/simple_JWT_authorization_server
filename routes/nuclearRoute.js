const express = require('express');
const router = express.Router();
const getAllKeys = require('../controllers/nuclearKeysController');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles');

router.get('/', verifyRoles(ROLES_LIST.Admin), getAllKeys);

module.exports = router;