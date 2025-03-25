import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Praticien from '../models/praticien';

// Création d'un praticien
export const createPraticien = asyncHandler(async (req: Request, res: Response) => {
  const praticien = new Praticien(req.body);
  const savedPraticien = await praticien.save();
  res.status(201).json(savedPraticien);
});

// Récupération de tous les praticiens
export const getPraticiens = asyncHandler(async (_req: Request, res: Response) => {
  const praticiens = await Praticien.find();
  res.status(200).json(praticiens);
});
