/**
 * Chat Routes
 */

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/auth');

// All chat routes require authentication
router.use(authMiddleware);

router.post('/', chatController.processChat);
router.get('/history/:conversationId', chatController.getChatHistory);

module.exports = router;
