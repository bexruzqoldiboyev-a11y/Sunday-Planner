import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { listPlaces, getPlace, listCities, getPhoto } from '../controllers/places.controller.js';

const router = Router();

router.get('/', asyncHandler(listPlaces));
router.get('/meta/cities', asyncHandler(listCities));
router.get('/:id/photo', asyncHandler(getPhoto));
router.get('/:id', asyncHandler(getPlace));

export default router;
