// Medicament.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IComposition {
  nom: string;
  quantite: string;
}

interface IPosologie {
  type: string;
  dose: string;
}

interface IMedicament extends Document {
  nomCommercial: string;
  depotLegal: string;
  composition: IComposition[];
  effets: string;
  contreIndications: string;
  interactions: string[];
  posologie: IPosologie[];
  famille: string;
}

const compositionSchema = new Schema<IComposition>({
  nom: { type: String, required: true },
  quantite: { type: String, required: true }
});

const medicamentSchema = new Schema<IMedicament>({
  nomCommercial: { type: String, required: true },
  depotLegal: { type: String, required: true },
  composition: [compositionSchema], 
  effets: { type: String, required: true },
  contreIndications: { type: String, required: true },
  interactions: [String], 
  posologie: [{ type: { type: String, required: true }, dose: { type: String, required: true } }],
  famille: { type: String, required: true }
});

const Medicament = mongoose.model<IMedicament>('Medicament', medicamentSchema);

export default Medicament;