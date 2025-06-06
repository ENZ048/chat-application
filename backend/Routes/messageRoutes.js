const express = require("express");
const router = express.Router();
const {getMessages, deleteMessage} = require("../controllers/messageController");
const protect = require("../middleware/protect");

router.get('/:userId', protect, getMessages);
router.delete('/:messageId', protect, deleteMessage);

module.exports = router;