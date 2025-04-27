import { Schema, model, Document } from 'mongoose';
import mongooseEncryption from 'mongoose-encryption';
import dotenv from 'dotenv';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

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

visiteurSchema.pre<IVisiteur>('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        console.log('[VISITEUR MODEL] Password hashed:', this.password); // pour debug
    }

    if (this.isModified('email')) {
        this.emailHash = crypto.createHash('sha256').update(this.email).digest('hex');
    }

    next();
});

// Vérifier le mot de passe lors de la connexion
visiteurSchema.methods.matchPassword = async function(enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const encryptionSecret = process.env.MONGOOSE_ENCRYPTION_SECRET;

if (!encryptionSecret) {
  throw new Error('La variable MONGOOSE_ENCRYPTION_SECRET n\'est pas définie.');
}

visiteurSchema.plugin(mongooseEncryption, {
    secret: encryptionSecret,
    encryptedFields: ['nom', 'prenom', 'tel', 'email', 'date_embauche'],
    excludeFromEncryption: ['password']
  });

const Visiteur = model<IVisiteur>('Visiteur', visiteurSchema);
export default Visiteur;