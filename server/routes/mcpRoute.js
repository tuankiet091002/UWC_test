import express from 'express';

import { getMCPs, getSingleMCP, createMCP, updateMCP, deleteMCP } from '../controllers/mcpController.js';
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();


router.get('/', authenticate, getMCPs);
router.get('/:id', authenticate, getSingleMCP);
router.post('/', authenticate, authorize("backofficer"), createMCP);
router.patch('/:id', authenticate, authorize("backofficer"), updateMCP);
router.delete('/:id', authenticate, authorize("backofficer"), deleteMCP);

export default router;