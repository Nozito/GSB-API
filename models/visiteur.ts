import { Schema, model, Document } from 'mongoose';
import mongooseEncryption from 'mongoose-encryption';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

interface IVisiteur extends Document {
    nom?: string;
    prenom?: string;
    tel?: string;
    email: string;
    emailHash?: string;
    date_embauche?: Date;
    password: string;
    visites?: string[];
}

const visiteurSchema = new Schema<IVisiteur>({
    nom: {
        type: String,
        required: false
    },
    prenom: {
        type: String,
        required: false
    },
    tel: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true, 
        unique: true
    },
    emailHash: {
        type: String,
        required: false, // Ne pas nécessairement requérir cela dans le schéma
        unique: true, 
    },
    date_embauche: {
        type: Date,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    visites: [{
        type: Schema.Types.ObjectId,
        ref: 'Visite'
    }]
});

// Calculer emailHash avant de sauvegarder le visiteur
visiteurSchema.pre<IVisiteur>('save', function(next) {
  if (this.isModified('email')) {
    this.emailHash = crypto.createHash('sha256').update(this.email).digest('hex');
  }
  next();
});

const encryptionSecret = process.env.MONGOOSE_ENCRYPTION_SECRET;

if (!encryptionSecret) {
  throw new Error('La variable MONGOOSE_ENCRYPTION_SECRET n\'est pas définie.');
}

visiteurSchema.plugin(mongooseEncryption, {
  secret: encryptionSecret,
  encryptedFields: ['nom', 'prenom', 'tel', 'email', 'date_embauche']
});

const Visiteur = model<IVisiteur>('Visiteur', visiteurSchema);
export default Visiteur;