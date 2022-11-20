const express = require('express');
const router = express.Router();
const handleRegistration = require('../controllers/registrationController');

router.post('/', handleRegistration);

module.exports = router;