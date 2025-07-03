# Application de Gestion de Tâches

Application web collaborative permettant de gérer des tâches en équipe.

## Fonctionnalités

- Création, modification et suppression de tâches
- Attribution de tâches à des utilisateurs
- Système de priorités et de statuts
- Interface utilisateur responsive
- API REST pour les opérations CRUD
- Authentification sécurisée avec JWT

## Technologies utilisées

### Frontend
- React.js
- React Router
- Context API
- Axios

### Backend
- Node.js
- Express.js
- JWT pour l'authentification
- bcryptjs pour le hachage des mots de passe

### Tests
- Jest pour les tests unitaires et d'intégration
- React Testing Library pour les tests de composants
- Selenium pour les tests E2E
- ESLint pour l'analyse de code

## Comment lancer l'application

### Prérequis
- Node.js (v14 ou supérieur)
- npm (v6 ou supérieur)

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/Doll293/Projet_gestion_taches.git
cd Projet_gestion_taches

# Installer les dépendances
npm install
cd backend && npm install
cd ../frontend && npm install
```

### Démarrer l'application

```bash
# À la racine du projet, démarrer les deux serveurs
npm start

# Ou individuellement
npm run start:backend   # Démarrer le backend sur le port 3001
npm run start:frontend  # Démarrer le frontend sur le port 3000
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

### Accès à l'application

```
Identifiants par défaut :
Email : admin@test.com
Mot de passe : password
```

## Tests

### Exécuter les tests

```bash
# Exécuter tous les tests
npm test

# Tests backend uniquement
npm run test:backend

# Tests frontend uniquement
npm run test:frontend

# Tests E2E
npm run test:e2e

# Couverture de code
npm run coverage
```

### Analyse de code

```bash
# Linter ESLint
npm run lint
```

## CI/CD

Ce projet utilise GitHub Actions pour l'intégration continue et le déploiement continu.

### Intégration Continue (CI)

Le workflow CI est déclenché à chaque push sur les branches `main` et `develop`, ainsi que pour chaque pull request vers ces branches. Il effectue les tâches suivantes :

1. **Tests Backend**
   - Tests unitaires
   - Tests d'intégration
   - Analyse de code avec ESLint
   - Génération de rapports de couverture

2. **Tests Frontend**
   - Tests unitaires des composants React
   - Analyse de code avec ESLint
   - Génération de rapports de couverture

### Déploiement Continu (CD)

Le workflow CD est déclenché automatiquement après un push réussi sur la branche `main` et si le workflow CI a réussi. Il effectue les tâches suivantes :

1. **Build**
   - Construction des assets frontend optimisés pour la production
   - Préparation des fichiers backend

2. **Déploiement**
   - Déploiement des fichiers sur le serveur de production
   - Vérifications post-déploiement

### Monitoring

Un workflow de monitoring vérifie périodiquement l'état de santé de l'application en production, en effectuant des requêtes HTTP vers les points d'accès clés.

## Structure du projet

```
projet-gestionnaire-taches/
├── backend/            # API REST Node.js/Express
│   ├── tests/
│   │   ├── unit/       # Tests unitaires
│   │   └── integration/# Tests d'intégration
├── frontend/           # Application React
│   ├── public/         # Fichiers statiques
│   ├── src/            # Code source React
│   │   ├── components/ # Composants React
│   │   ├── contexts/   # Contexts API (état global)
│   │   └── __tests__/  # Tests unitaires frontend
└── tests/
    ├── e2e/           # Tests End-to-End
    └── README.md      # Documentation des tests
```