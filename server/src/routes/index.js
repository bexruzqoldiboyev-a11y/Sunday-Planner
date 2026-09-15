import { Router } from 'express';
import planRoutes from './plan.routes.js';
import placesRoutes from './places.routes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'sunday-planner-api',
    placesProvider: process.env.PLACES_PROVIDER || 'demo',
    ai: Boolean(process.env.ANTHROPIC_API_KEY),
    photos: Boolean(process.env.GOOGLE_MAPS_API_KEY),
    time: new Date().toISOString(),
  });
});

router.use('/plan', planRoutes);
router.use('/places', placesRoutes);

export default router;
