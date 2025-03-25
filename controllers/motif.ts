import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Motif from '../models/motif';

// Création d'un motif
export const createMotif = asyncHandler(async (req: Request, res: Response) => {
  const motif = new Motif(req.body);
  const savedMotif = await motif.save();
  res.status(201).json(savedMotif);
});

// Récupération de tous les motifs
export const getMotifs = asyncHandler(async (_req: Request, res: Response) => {
  const motifs = await Motif.find();
  res.status(200).json(motifs);
});
