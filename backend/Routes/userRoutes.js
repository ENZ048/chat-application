const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const emailVerifyController = require('../controllers/emailVerifyController')

router.post('/register', registerController);
router.get('/:userId/verify/:token', emailVerifyController);

module.exports = router;