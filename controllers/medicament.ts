import { Request, Response } from 'express';
import Medicament from '../models/medicament';


export const getAllMedicaments = async (req: Request, res: Response) => {
    try {
      const meds = await Medicament.find();
      res.status(200).json(meds);
    } catch (e) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  };
  
  export const createMedicament = async (req: Request, res: Response) => {
    try {
      const med = new Medicament(req.body);
      await med.save();
      res.status(201).json(med);
    } catch (e) {
      res.status(400).json({ error: 'Erreur de création', detail: e });
    }
  };