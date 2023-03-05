import express from "express";

import { getTrucks, getSingleTruck, createTruck, updateTruck, deleteTruck } from "../controllers/truckController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router()

router.get('/', authenticate, getTrucks);
router.get('/:id', authenticate, getSingleTruck);
router.post('/', authenticate, authorize("backofficer"), createTruck);
router.patch('/:id', authenticate, authorize("backofficer"), updateTruck);
router.delete('/:id', authenticate, authorize("backofficer"), deleteTruck);

export default router;