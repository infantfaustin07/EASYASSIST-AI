import express from 'express';
import { statsController } from '../controllers/statsController.js';

const router = express.Router();

router.get('/stats', statsController.getDashboardStats);
router.get('/health', statsController.getHealth);
router.post('/stats/reset', statsController.resetDemo);

export default router;
