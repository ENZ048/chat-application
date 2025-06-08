const express = require('express');
const router = express.Router();
const {createGroup} = require('../controllers/groupController');
const protect = require('../middleware/protect');

router.post('/', protect, createGroup);

module.exports = router;