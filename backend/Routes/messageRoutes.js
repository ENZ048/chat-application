const express = require("express");
const router = express.Router();
const {getMessages} = require("../controllers/messageController");
const protect = require("../middleware/protect");

router.get('/:userId', protect, getMessages);

module.exports = router;