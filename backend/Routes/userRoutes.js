const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const loginController = require('../controllers/loginCntroller');
const protect = require('../middleware/protect');
const { getMe, updateProfile } = require('../controllers/userController');
const {getAllUsers} = require('../controllers/getAllUsers');

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile)
router.get('/people', protect, getAllUsers);

module.exports = router;