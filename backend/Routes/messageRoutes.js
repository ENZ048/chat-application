const express = require("express");
const router = express.Router();
const {getMessages, deleteMessage, readReceipt} = require("../controllers/messageController");
const protect = require("../middleware/protect");

router.get('/:userId', protect, getMessages);
router.delete('/:messageId', protect, deleteMessage);
router.patch('/:messageId/read', protect, readReceipt);

module.exports = router;