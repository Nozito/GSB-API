import { Schema, model, Document } from 'mongoose';

interface IPraticien extends Document {
    nom: string;
    prenom: string;
    tel: string;
    email: string;
    rue: string;
    code_postal: string;
    ville: string;
    visites: Schema.Types.ObjectId[];
  }
  
  const praticienSchema = new Schema<IPraticien>({
    nom: {
      type: String,
      required: true
    },
    prenom: {
      type: String,
      required: true
    },
    tel: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    rue: {
      type: String,
      required: true
    },
    code_postal: {
      type: String,
      required: true
    },
    ville: {
      type: String,
      required: true
    },
    visites: [{
      type: Schema.Types.ObjectId,
      ref: 'Visite'
    }]
  });
  
  const Praticien = model<IPraticien>('Praticien', praticienSchema);
  export default Praticien;