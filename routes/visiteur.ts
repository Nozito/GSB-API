import express from 'express';
import {
  createVisiteur,
  getVisiteurs,
  getVisiteurById,
  deleteVisiteur,
  signup, 
  login, 
  signupValidators } from '../controllers/visiteur';

const router = express.Router();


router.post('/', createVisiteur);
router.get('/', getVisiteurs);
router.get('/:id', getVisiteurById);
router.delete('/:id', deleteVisiteur);
router.post('/signup', signupValidators, signup);
router.post('/login', login);


export default router;
