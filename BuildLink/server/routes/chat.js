const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// @route   POST /api/chat
// @desc    Send a message to the AI chatbot
router.post("/", chatController.generateChatResponse);

module.exports = router;
