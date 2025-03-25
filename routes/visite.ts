import { Router } from 'express';
import { createVisite, getVisites } from '../controllers/visite';

const router = Router();

// Routes pour Visite
router.post('/', createVisite);
router.get('/', getVisites);

export default router;