import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validatePlanRequest } from '../middleware/validatePlanRequest.js';
import { createPlan, swapPlanActivity, optimizePlan } from '../controllers/plan.controller.js';

const router = Router();

router.post('/', validatePlanRequest, asyncHandler(createPlan));
router.post('/swap', asyncHandler(swapPlanActivity));
router.post('/optimize', asyncHandler(optimizePlan));

export default router;
