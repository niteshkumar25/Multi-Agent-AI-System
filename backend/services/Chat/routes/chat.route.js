import express from "express";
import { createConversation, getConversations, getMessages, saveMessage, updateConversation } from "../controllers/chat.controller.js";

const router = express.Router();


router.get('/create-conversation', createConversation)
router.post('/update-conversation', updateConversation)

router.get('/get-conversations', getConversations)
router.post('/save-message', saveMessage)
router.get('get-messages/:conversationId', getMessages)

export default router