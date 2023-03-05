import express from 'express';

import { getTasks, getSingleTask, createTask, updateTask, checkTask, deleteTask } from '../controllers/TaskController.js';
import { authenticate, authorize } from "../middleware/auth.js"

const router = express.Router();


router.get('/', authenticate, getTasks);
router.get('/:id', authenticate, getSingleTask);
router.post('/', authenticate, authorize("backofficer"), createTask);
router.patch('/:id', authenticate, authorize("backofficer"), updateTask);
router.post('/:id', authenticate, authorize("collector", "janitor"), checkTask);
router.delete('/:id', authenticate, authorize("backofficer"), deleteTask);

export default router;