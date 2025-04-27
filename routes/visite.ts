import { Router } from 'express';
import { createVisite, getVisites, deleteVisite, updateVisite } from '../controllers/visite';


const router = Router();

// Routes pour Visite
router.post('/', createVisite);
router.get('/', getVisites);
router.delete('/:id', deleteVisite);
router.put('/:id', updateVisite);
export default router;