import express from 'express';
import {
  getVisiteurs,
  getVisiteurById,
  deleteVisiteur,
  signup, 
  login, 
  signupValidators } from '../controllers/visiteur';

const router = express.Router();


router.post('/signup', signupValidators, signup);
router.post('/login', login);
router.get('/', getVisiteurs);
router.get('/:id', getVisiteurById);
router.delete('/:id', deleteVisiteur);


export default router;
