import { Router } from 'express';
import { createPraticien, getPraticiens } from '../controllers/praticien';

const router = Router();

// Routes pour Praticien
router.post('/', createPraticien);
router.get('/', getPraticiens);

export default router;