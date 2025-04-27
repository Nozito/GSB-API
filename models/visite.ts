import { Schema, model, Document } from 'mongoose';

interface IVisite extends Document {
  date_visite: Date;
  commentaire: string;
  visiteur: Schema.Types.ObjectId;
  praticien: Schema.Types.ObjectId;
  motif: Schema.Types.ObjectId;
}

const visiteSchema = new Schema<IVisite>({
  date_visite: {
    type: Date,
    required: true,
  },
  commentaire: {
    type: String,
    required: true,
    trim: true,  // Ajout d'un trim pour enlever les espaces en début et fin de commentaire
  },
  visiteur: {
    type: Schema.Types.ObjectId,
    ref: 'Visiteur',
    required: true,
    validate: {
      validator: async function (id: Schema.Types.ObjectId) {
        const visiteurExists = await this.model('Visiteur').exists({ _id: id });
        return visiteurExists; // Vérifie si le visiteur existe dans la collection 'Visiteur'
      },
      message: 'Le visiteur spécifié n\'existe pas.',
    },
  },
  praticien: {
    type: Schema.Types.ObjectId,
    ref: 'Praticien',
    required: true,
    validate: {
      validator: async function (id: Schema.Types.ObjectId) {
        const praticienExists = await this.model('Praticien').exists({ _id: id });
        return praticienExists; // Vérifie si le praticien existe dans la collection 'Praticien'
      },
      message: 'Le praticien spécifié n\'existe pas.',
    },
  },
  motif: {
    type: Schema.Types.ObjectId,
    ref: 'Motif',
    required: true,
    validate: {
      validator: async function (id: Schema.Types.ObjectId) {
        const motifExists = await this.model('Motif').exists({ _id: id });
        return motifExists; // Vérifie si le motif existe dans la collection 'Motif'
      },
      message: 'Le motif spécifié n\'existe pas.',
    },
  },
}, {
  timestamps: true, // Ajout des timestamps pour suivre les dates de création et modification
});

const Visite = model<IVisite>('Visite', visiteSchema);
export default Visite;