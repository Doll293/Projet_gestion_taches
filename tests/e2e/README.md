# Tests E2E (End-to-End)

Ce dossier contient les tests E2E pour l'application de gestion de tâches, utilisant Selenium WebDriver et Jest.

## Prérequis

- Node.js >= 16.x
- Chrome navigateur
- ChromeDriver compatible avec votre version de Chrome

## Installation

```bash
npm install
```

## Configuration

Assurez-vous que :
1. Le backend est en cours d'exécution sur `http://localhost:5000`
2. Le frontend est en cours d'exécution sur `http://localhost:3000`
3. La version de ChromeDriver dans `package.json` correspond à votre version de Chrome

Si vous avez des problèmes de compatibilité avec ChromeDriver, mettez à jour la version dans `package.json` :
```json
{
  "dependencies": {
    "chromedriver": "^XXX.0.0"  // Remplacez XXX par votre version de Chrome
  }
}
```

## Exécution des tests

```bash
npm test
```

Cela exécutera tous les tests E2E. Les tests sont exécutés en mode headless par défaut.

## Structure des tests

### `auth.test.js`
Tests pour les fonctionnalités d'authentification :
- Connexion
- Déconnexion

### `tasks.test.js`
Tests pour les fonctionnalités de gestion des tâches :
- Création d'une nouvelle tâche
- Modification d'une tâche existante
- Changement de statut d'une tâche
- Suppression d'une tâche

## Dépannage

### Problèmes courants

1. **Version de ChromeDriver incompatible**
   - Vérifiez votre version de Chrome : `chrome://version/`
   - Mettez à jour la version de ChromeDriver dans package.json
   - Réinstallez les dépendances : `npm install`

2. **Sélecteurs introuvables**
   - Vérifiez que les sélecteurs CSS/XPath dans les tests correspondent à la structure de votre application
   - Augmentez les timeouts si nécessaire

3. **Erreurs de connexion**
   - Vérifiez que le backend et le frontend sont bien en cours d'exécution
   - Vérifiez que les URLs sont correctes dans les tests

## Exécution dans un environnement CI/CD

Ces tests peuvent être intégrés dans un pipeline CI/CD comme GitHub Actions. Voici un exemple de configuration :

```yaml
- name: Install E2E dependencies
  run: |
    cd tests/e2e
    npm install

- name: Run E2E tests
  run: |
    cd tests/e2e
    npm test
```

## Extension des tests

Pour ajouter de nouveaux tests E2E :
1. Créez un nouveau fichier de test dans ce dossier
2. Importez les dépendances nécessaires
3. Configurez le driver Selenium
4. Écrivez vos tests en suivant le modèle existant
