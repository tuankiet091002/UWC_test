import express from 'express';

import { getMessages, sendMessage } from '../controllers/messageController.js';
import { authenticate } from "../middleware/auth.js";

const router = express.Router();


router.get('/chat/:id', authenticate, getMessages);
router.post('/chat/:id', authenticate, sendMessage);


export default router;