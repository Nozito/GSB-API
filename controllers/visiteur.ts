import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Visiteur from '../models/visiteur';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const signupValidators = [
  body('email').isEmail().withMessage('Veuillez entrer un email valide.').normalizeEmail(),
  body('password')
    .isLength({ min: 12 }).withMessage("Le mot de passe doit contenir au moins 12 caractères.")
    .matches(/[A-Z]/).withMessage("Le mot de passe doit contenir au moins une lettre majuscule.")
    .matches(/[a-z]/).withMessage("Le mot de passe doit contenir au moins une lettre minuscule.")
    .matches(/\d/).withMessage("Le mot de passe doit contenir au moins un chiffre.")
    .matches(/[!@#$%^&*(),.?\":{}|<>]/).withMessage("Le mot de passe doit contenir au moins un caractère spécial."),
];

export const signup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { nom, prenom, tel, email, password, date_embauche } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email et mot de passe sont obligatoires.' });
    return;
  }

  const emailHash = crypto.createHash('sha256').update(email).digest('hex');
  const existing = await Visiteur.findOne({ emailHash });

  if (existing) {
    res.status(400).json({ error: 'Cet email est déjà utilisé.' });
    return;
  }

  console.log('[SIGNUP] Hashing password...');
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('[SIGNUP] Password hashed.');

  const visiteur = new Visiteur({
    nom,
    prenom,
    tel,
    email,
    emailHash,
    password: hashedPassword,
    date_embauche
  });

  await visiteur.save();

  res.status(201).json({ message: 'Visiteur inscrit avec succès', visiteurId: visiteur._id });
});

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email et mot de passe sont obligatoires.' });
    return;
  }

  try {
    const hashedEmail = crypto.createHash('sha256').update(email).digest('hex');
    console.log('[LOGIN] Recherche emailHash :', hashedEmail);

    const visiteur = await Visiteur.findOne({ emailHash: hashedEmail });

    if (!visiteur) {
      console.warn('[LOGIN] Visiteur non trouvé pour emailHash:', hashedEmail);
      res.status(401).json({ error: 'Visiteur non trouvé !' });
      return;
    }

    console.log('[LOGIN] Mot de passe reçu:', password);
    console.log('[LOGIN] Mot de passe stocké (hashé):', visiteur.password);


    const token = jwt.sign(
      { visiteurId: visiteur._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    res.status(200).json({ visiteurId: visiteur._id, token, nom: visiteur.nom, prenom: visiteur.prenom });
  } catch (error) {
    console.error('[LOGIN] Erreur interne :', error);
    res.status(500).json({ error: 'Erreur interne.' });
  }
};

// Récupération de tous les visiteurs
export const getVisiteurs = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const visiteurs = await Visiteur.find();
  res.status(200).json(visiteurs);
});

// Récupération d'un visiteur par ID
export const getVisiteurById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const visiteur = await Visiteur.findById(id);

  if (!visiteur) {
    res.status(404).json({ message: 'Visiteur non trouvé' });
    return;
  }

  res.status(200).json(visiteur);
});

// Suppression d'un visiteur par ID
export const deleteVisiteur = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const visiteur = await Visiteur.findByIdAndDelete(id);

  if (!visiteur) {
    res.status(404).json({ message: 'Visiteur non trouvé ou déjà supprimé' });
    return;
  }

  res.status(200).json({ message: 'Visiteur supprimé avec succès' });
});
