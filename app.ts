import express from 'express';
import mongoose from 'mongoose';
import visiteurRoutes from './routes/visiteur';
import motifRoutes from './routes/motif';
import praticienRoutes from './routes/praticien';
import visiteRoutes from './routes/visite';
import portefeuilleRoutes from './routes/portefeuille';
import { config } from 'dotenv';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Routes
app.use('/api/visiteurs', visiteurRoutes);
app.use('/api/motifs', motifRoutes);
app.use('/api/praticiens', praticienRoutes);
app.use('/api/visites', visiteRoutes);
app.use('/api/portefeuille', portefeuilleRoutes);

// Récupérer les variables d'environnement
const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_CLUSTER_URL = process.env.MONGODB_CLUSTER_URL;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

const uri = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER_URL}/${MONGODB_DB_NAME}?retryWrites=true&w=majority`;

// MongoDB Connection
mongoose.connect(uri)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

export default app;