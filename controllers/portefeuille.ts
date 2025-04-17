import { Request, Response, NextFunction } from 'express';
import Portefeuille from '../models/portefeuille';

const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const ajouterAuPortefeuille = asyncHandler(async (req: Request, res: Response) => {
  const { id_visiteur, id_praticien } = req.body;

  if (!id_visiteur || !id_praticien) {
    return res.status(400).json({ message: 'id_visiteur et id_praticien sont requis.' });
  }

  const existeDeja = await Portefeuille.findOne({
    visiteur: id_visiteur,
    praticien: id_praticien
  });

  if (existeDeja) {
    return res.status(409).json({ message: 'Le praticien est déjà dans le portefeuille.' });
  }

  const ajout = new Portefeuille({ visiteur: id_visiteur, praticien: id_praticien });
  await ajout.save();

  return res.status(201).json({ message: 'Praticien ajouté au portefeuille avec succès.' });
});

export const supprimerDuPortefeuille = asyncHandler(async (req: Request, res: Response) => {
  const { id_visiteur, id_praticien } = req.body;

  if (!id_visiteur || !id_praticien) {
    return res.status(400).json({ message: 'id_visiteur et id_praticien sont requis.' });
  }

  const suppression = await Portefeuille.findOneAndDelete({
    visiteur: id_visiteur,
    praticien: id_praticien
  });

  if (!suppression) {
    return res.status(404).json({ message: 'Aucune correspondance trouvée dans le portefeuille.' });
  }

  return res.status(200).json({ message: 'Praticien supprimé du portefeuille avec succès.' });
});

export const voirPortefeuille = asyncHandler(async (req: Request, res: Response) => {
  const { id_visiteur } = req.params;

  if (!id_visiteur) {
    return res.status(400).json({ message: 'id_visiteur est requis.' });
  }

  const portefeuille = await Portefeuille.find({ visiteur: id_visiteur })
    .populate('praticien')
    .exec();

  if (!portefeuille || portefeuille.length === 0) {
    return res.status(404).json({ message: 'Portefeuille vide ou introuvable.' });
  }

  return res.status(200).json(portefeuille);
});