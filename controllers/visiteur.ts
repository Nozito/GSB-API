import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Visiteur from '../models/visiteur';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const signupValidators = [
  body('email').isEmail().withMessage('Veuillez entrer un email valide.').normalizeEmail(),
  body('password').isLength({ min: 5 }).withMessage('Le mot de passe doit contenir au moins 5 caractères.').trim(),
];

export const signup = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
	res.status(400).json({ error: errors.array()[0].msg });
	return;
  }

  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const hashedEmail = crypto.createHash('sha256').update(email).digest('hex');
  console.log('Request body:', req.body);

  try {
	const visiteur = new Visiteur({ email, password: hashedPassword, emailHash: hashedEmail });
	await visiteur.save();
	res.status(201).json({ message: 'Visiteur créé !' });
  } catch (error) {
  console.error('Erreur lors de la création du visiteur :', error);
	res.status(500).json({ error: 'Erreur interne' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  console.log('Request body:', req.body);

  try {
  const hashedEmail = crypto.createHash('sha256').update(email).digest('hex');
  console.log('hashedEmail', hashedEmail)
	const visiteur = await Visiteur.findOne({emailHash:hashedEmail});
	if (!visiteur) {
  	res.status(401).json({ error: 'Visiteur non trouvé !' });
  	return;
	}

	const isPasswordValid = await bcrypt.compare(password, visiteur.password);
	if (!isPasswordValid) {
  	res.status(401).json({ error: 'Mot de passe incorrect !' });
  	return;
	}

	const token = jwt.sign(
  	{ visiteurId: visiteur._id },
  	process.env.JWT_SECRET as string,
  	{ expiresIn: '24h' }
	);

	res.status(200).json({ visiteurId: visiteur._id, token });
  } catch (error) {
	res.status(500).json({ error: 'Erreur interne.' });
  }
};


// Création d'un visiteur
export const createVisiteur = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // Validation des champs
  await Promise.all([
    body('email').isEmail().withMessage("L'adresse e-mail est invalide.").run(req),
    body('password')
      .isLength({ min: 12 }).withMessage("Le mot de passe doit contenir au moins 12 caractères.")
      .matches(/[A-Z]/).withMessage("Le mot de passe doit contenir au moins une lettre majuscule.")
      .matches(/[a-z]/).withMessage("Le mot de passe doit contenir au moins une lettre minuscule.")
      .matches(/\d/).withMessage("Le mot de passe doit contenir au moins un chiffre.")
      .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("Le mot de passe doit contenir au moins un caractère spécial.")
      .run(req),
  ]);


  // Vérification des erreurs de validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  // Hashage du mot de passe
  const hash = await bcrypt.hash(req.body.password, 10);

  // Création du visiteur
  const visiteur = new Visiteur({
    nom: req.body.nom,
    prenom: req.body.prenom,
    tel: req.body.tel,
    email: req.body.email,
    date_embauche: req.body.date_embauche,
    login: req.body.login,
    password: hash,
    visites: req.body.visites,
  });

  // Sauvegarde et réponse
  const savedVisiteur = await visiteur.save();
  res.status(201).json(savedVisiteur);
});

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
