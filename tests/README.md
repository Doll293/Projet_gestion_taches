# Tests du Projet Gestionnaire de Tâches

Ce dossier contient l'ensemble des tests pour l'application de gestion de tâches.

## Structure des tests

```
projet-gestionnaire-taches/
├── backend/
│   ├── tests/
│   │   ├── unit/           # Tests unitaires backend
│   │   └── integration/    # Tests d'intégration backend
├── frontend/
│   ├── src/
│   │   └── __tests__/      # Tests unitaires frontend
└── tests/
    └── e2e/               # Tests End-to-End avec Selenium
```

## Types de tests

### Tests unitaires

Les tests unitaires vérifient le bon fonctionnement des composants individuels de l'application :
- **Backend** : Fonctions d'authentification, gestion des tâches, etc.
- **Frontend** : Composants React, hooks personnalisés, etc.

### Tests d'intégration

Les tests d'intégration vérifient que les différents composants fonctionnent correctement ensemble :
- **API Backend** : Tests des endpoints HTTP, authentification, etc.

### Tests End-to-End (E2E)

Les tests E2E avec Selenium simulent un utilisateur réel interagissant avec l'application :
- Flux d'authentification (connexion, déconnexion)
- Gestion des tâches (création, modification, suppression)

## Exécution des tests

### Tests Backend

```bash
cd backend
# Exécuter tous les tests
npm test

# Exécuter uniquement les tests unitaires
npm run test:unit

# Exécuter uniquement les tests d'intégration
npm run test:integration

# Exécuter les tests avec couverture de code
npm run test:coverage
```

### Tests Frontend

```bash
cd frontend
# Exécuter les tests
npm test

# Exécuter les tests avec couverture de code
npm run test:coverage
```

### Tests E2E

```bash
cd tests/e2e
# Installer les dépendances
npm install

# Exécuter les tests E2E
npm test
```

## Analyse de code

Le projet utilise ESLint pour l'analyse statique du code :

```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

## Métriques de couverture de code

Les rapports de couverture de code sont générés dans les dossiers `coverage` respectifs du backend et du frontend après l'exécution des commandes `test:coverage`.
