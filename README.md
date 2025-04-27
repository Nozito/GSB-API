# 🏥 API de Gestion des Rapports de Visite

## 📌 Présentation
Cette API Express.js permet de gérer les **rapports de visite** réalisés par des **visiteurs médicaux** lors de leurs rencontres avec des **praticiens**.  
Elle offre des fonctionnalités pour **ajouter, modifier, consulter et supprimer** des rapports de visite.

## 🛠️ Technologies utilisées
- **Node.js** : Runtime pour exécuter JavaScript côté serveur.
- **Express.js** : Framework web rapide et minimaliste pour créer l'API REST.
- **MongoDB (ou PostgreSQL)** : Base de données pour stocker les rapports.
- **JWT (JSON Web Token)** : Authentification et sécurisation des accès.
- **Express-rate-limit** : Protection contre les attaques par force brute sur l’authentification.

## 🚀 Fonctionnalités
- 🔹 **Gestion des utilisateurs** (inscription, connexion avec JWT).
- 🔹 **Création de rapports de visite** pour chaque visiteur médical.
- 🔹 **Modification et suppression des rapports** par leurs auteurs.
- 🔹 **Consultation des rapports** selon les droits d’accès.
- 🔹 **Sécurisation de l’API** avec JWT et rate-limiting.

### 🔒 **Sécurité**
L’API implémente plusieurs mécanismes pour garantir la protection des données et des accès :  

- **🔐 Chiffrement des données sensibles** : Les informations personnelles sont chiffrées avant stockage.  
- **🔑 Hashage des mots de passe** : Utilisation de `bcrypt` avec un sel sécurisé pour stocker les mots de passe de manière irréversible.  
- **🛡️ Authentification sécurisée** :  
  - Utilisation de **JWT (JSON Web Token)** pour gérer les sessions utilisateurs.  
  - Expiration automatique des tokens après **1 heure**.  
- **📊 Protection contre les attaques** :  
  - `express-rate-limit` pour limiter les tentatives de connexion et éviter les attaques bruteforce.  
  - `helmet` pour sécuriser les en-têtes HTTP contre les vulnérabilités (XSS, Clickjacking, etc.).  

## 🔧 Installation et Configuration
### 1️⃣ **Cloner le projet**
```bash
git clone https://github.com/Nozito/GSBP-API.git
```

### 2️⃣ **Installer Node.js et Express**
```bash
npm init -y
npm install
```

### 3️⃣ **Structure du projet**
```plaintext
api-auth/
│── server.ts
│── .env
│── config/
│   ├── db.ts
│── models/
│   ├── User.ts
│── routes/
│   ├── authRoutes.ts
│── controllers/
│   ├── authController.ts
```

### 4️⃣ **.env**
```plaintext
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/monapi
MONGOOSE_ENCRYPTION_SECRET=super_secret
JWT_SECRET=super_secret
PORT=6060
```

### 5️⃣ **lancer l'API**
```bash
npx ts-node server.ts
```
