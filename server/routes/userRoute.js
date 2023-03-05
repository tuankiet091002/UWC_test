import express from 'express';

import { getUsers, getSingleUser, updateUser, deleteUser } from '../controllers/userController.js';
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();


router.get('/', getUsers);
router.get('/:id', getSingleUser);
router.patch('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, deleteUser);

export default router;