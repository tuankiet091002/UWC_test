import express from 'express';

import { getChats, getSingleChat, createChat, updateChat, deleteChat } from '../controllers/chatController.js';
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();


router.route("/").get(authenticate, getChats);
router.route("/:id").get(authenticate, getSingleChat);
router.route("/").post(authenticate, createChat);
router.route("/:id").patch(authenticate, updateChat);
router.route("/:id").delete(authenticate, deleteChat);

export default router;