const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const emailVerifyController = require('../controllers/emailVerifyController');
const loginController = require('../controllers/loginCntroller');
const protect = require('../middleware/protect');
const { getMe, updateProfile } = require('../controllers/userController');

router.post('/register', registerController);
router.get('/:userId/verify/:token', emailVerifyController);
router.post('/login', loginController);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile)

module.exports = router;