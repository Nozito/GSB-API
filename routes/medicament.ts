import { Router } from 'express';
import { getAllMedicaments, createMedicament } from '../controllers/medicament';

const router = Router();
router.get('/', getAllMedicaments);
router.post('/', createMedicament);

export default router;