import express from 'express';
import { ajouterAuPortefeuille, supprimerDuPortefeuille, voirPortefeuille } from '../controllers/portefeuille';

const router = express.Router();

// Ajouter un praticien au portefeuille
router.post('/portefeuille', ajouterAuPortefeuille);

// Supprimer un praticien du portefeuille
router.delete('/portefeuille', supprimerDuPortefeuille);

// Voir le portefeuille d'un visiteur
router.get('/portefeuille/:id_visiteur', voirPortefeuille);

export default router;