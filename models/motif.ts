import { Schema, model, Document } from 'mongoose';

interface IMotif extends Document {
  libelle: string;
}

const motifSchema = new Schema<IMotif>({
  libelle: {
    type: String,
    required: true
  }
});

const Motif = model<IMotif>('Motif', motifSchema);
export default Motif;