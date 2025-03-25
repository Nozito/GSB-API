import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Visite from '../models/visite';

// Création d'une visite
export const createVisite = asyncHandler(async (req: Request, res: Response) => {
  const visite = new Visite(req.body);
  const savedVisite = await visite.save();
  res.status(201).json(savedVisite);
});

// Récupération de toutes les visites
export const getVisites = asyncHandler(async (_req: Request, res: Response) => {
  const visites = await Visite.find().populate('visiteur praticien motif');
  res.status(200).json(visites);
});
