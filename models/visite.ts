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
      required: true
    },
    commentaire: {
      type: String,
      required: true
    },
    visiteur: {
      type: Schema.Types.ObjectId,
      ref: 'Visiteur',
      required: true
    },
    praticien: {
      type: Schema.Types.ObjectId,
      ref: 'Praticien',
      required: true
    },
    motif: {
      type: Schema.Types.ObjectId,
      ref: 'Motif',
      required: true
    }
  });
  
  const Visite = model<IVisite>('Visite', visiteSchema);
  export default Visite;