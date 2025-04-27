import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import Visite from '../models/visite';
import Visiteur from '../models/visiteur';
import Praticien from '../models/praticien';
import Motif from '../models/motif';
import router from '../routes/visite';

// Création d'une visite
export const createVisite = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { date_visite, commentaire, visiteurId, praticienId, motifId } = req.body;

  // Vérification que tous les champs sont présents
  if (!date_visite || !commentaire || !visiteurId || !praticienId || !motifId) {
    res.status(400).json({ error: 'Tous les champs (date_visite, commentaire, visiteurId, praticienId, motifId) sont requis.' });
    return; // Terminer la fonction ici
  }

  try {
    // Vérification de l'existence du visiteur
    const visiteur = await Visiteur.findById(visiteurId);
    if (!visiteur) {
      res.status(404).json({ error: 'Le visiteur spécifié n\'existe pas.' });
      return; // Terminer la fonction ici
    }

    // Vérification de l'existence du praticien
    const praticien = await Praticien.findById(praticienId);
    if (!praticien) {
      res.status(404).json({ error: 'Le praticien spécifié n\'existe pas.' });
      return; // Terminer la fonction ici
    }

    // Vérification de l'existence du motif
    const motif = await Motif.findById(motifId);
    if (!motif) {
      res.status(404).json({ error: 'Le motif spécifié n\'existe pas.' });
      return; // Terminer la fonction ici
    }

    // Créer la nouvelle visite avec les données du body
    const visite = new Visite({
      date_visite,
      commentaire,
      visiteur: visiteurId,  // Lien avec le visiteur
      praticien: praticienId,  // Lien avec le praticien
      motif: motifId  // Lien avec le motif
    });

    // Sauvegarder la visite dans la base de données
    const savedVisite = await visite.save();

    // Mise à jour du visiteur pour ajouter cette visite dans son tableau de visites
    await Visiteur.findByIdAndUpdate(visiteurId, {
      $push: { visites: savedVisite._id }
    });

    // Mise à jour du praticien pour ajouter cette visite dans son tableau de visites
    await Praticien.findByIdAndUpdate(praticienId, {
      $push: { visites: savedVisite._id }
    });

    // Retourner la visite créée en réponse avec la population des données de référence
    const populatedVisite = await Visite.findById(savedVisite._id)
      .populate('visiteur praticien motif') // Utilisation de populate pour lier les références
      .exec();  // Utilisation de exec() pour exécuter la promesse

    // Réponse avec la visite peuplée
    res.status(201).json(populatedVisite);
  } catch (error) {
    console.error("Erreur lors de la création de la visite :", error);
    next(error); // Passer l'erreur à Express si nécessaire
  }
});

// Récupération de toutes les visites avec les détails du visiteur, praticien et motif
export const getVisites = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  try {
    // Utilisation de populate pour remplir les références 'visiteur', 'praticien' et 'motif'
    const visites = await Visite.find().populate('visiteur praticien motif').exec();
    res.status(200).json(visites);
  } catch (error) {
    console.error("Erreur lors de la récupération des visites : ", error);
    res.status(500).json({ error: 'Erreur interne lors de la récupération des visites.' });
  }
});

// Mise à jour d'une visite
export const updateVisite = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { date_visite, commentaire, visiteurId, praticienId, motifId } = req.body;

  // Vérification que tous les champs sont présents
  if (!date_visite || !commentaire || !visiteurId || !praticienId || !motifId) {
    res.status(400).json({ error: 'Tous les champs (date_visite, commentaire, visiteurId, praticienId, motifId) sont requis.' });
    return;
  }

  try {
    // Vérification de l'existence de la visite
    const visite = await Visite.findById(id);
    if (!visite) {
      res.status(404).json({ error: 'La visite spécifiée n\'existe pas.' });
      return;
    }

    // Mise à jour de la visite
    const updatedVisite = await Visite.findByIdAndUpdate(id, {
      date_visite,
      commentaire,
      visiteur: visiteurId,
      praticien: praticienId,
      motif: motifId
    }, { new: true }).populate('visiteur praticien motif');

    res.status(200).json(updatedVisite);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la visite :", error);
    res.status(500).json({ error: 'Erreur interne lors de la mise à jour de la visite.' });
  }
});

// Suppression d'une visite
export const deleteVisite = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const visite = await Visite.findByIdAndDelete(id);
    if (!visite) {
      res.status(404).json({ error: 'La visite spécifiée n\'existe pas.' });
      return;
    }

    // Mise à jour des documents liés pour retirer la visite
    const visiteurId = visite.visiteur;
    const praticienId = visite.praticien;
    const motifId = visite.motif;

    // Retirer la visite des collections correspondantes
    await Visiteur.findByIdAndUpdate(visiteurId, {
      $pull: { visites: id }
    });
    await Praticien.findByIdAndUpdate(praticienId, {
      $pull: { visites: id }
    });
    await Motif.findByIdAndUpdate(motifId, {
      $pull: { visites: id }
    });

    res.status(200).json({ message: 'Visite supprimée avec succès' });
  } catch (error) {
    console.error("Erreur lors de la suppression de la visite :", error);
    res.status(500).json({ error: 'Erreur interne lors de la suppression de la visite.' });
  }
});

export default router;