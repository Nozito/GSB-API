import { Schema, model, Document } from 'mongoose';

interface IPortefeuille extends Document {
    visiteur: Schema.Types.ObjectId;
    praticien: Schema.Types.ObjectId;
  }

  const portefeuilleSchema = new Schema<IPortefeuille>({
    visiteur: {
      type: Schema.Types.ObjectId,
      ref: 'Visiteur',
      required: true
    },
    praticien: {
      type: Schema.Types.ObjectId,
      ref: 'Praticien',
      required: true
    }
  });
const Portefeuille = model<IPortefeuille>('Portefeuille', portefeuilleSchema);
export default Portefeuille;