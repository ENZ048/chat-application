const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const emailVerifyController = require('../controllers/emailVerifyController');
const loginController = require('../controllers/loginCntroller');

router.post('/register', registerController);
router.get('/:userId/verify/:token', emailVerifyController);
router.post('/login', loginController);

module.exports = router;