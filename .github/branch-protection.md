# Configuration des règles de protection de branche

Pour garantir la qualité du code et la stabilité du projet, les règles de protection de branche suivantes devraient être configurées sur GitHub.

## Branches à protéger

- `main` (branche de production)
- `develop` (branche de développement)

## Règles recommandées

### Pour la branche `main`

1. **Require pull request reviews before merging**
   - Nombre requis d'approbations : 1
   - Rejeter les demandes de modifications lorsque de nouveaux commits sont ajoutés
   - Exiger l'approbation du dernier commit

2. **Require status checks to pass before merging**
   - Vérifications requises :
     - `backend-tests`
     - `frontend-tests`

3. **Require conversation resolution before merging**
   - Toutes les conversations doivent être résolues avant le merge

4. **Require signed commits**
   - Tous les commits doivent être signés

5. **Do not allow bypassing the above settings**
   - Même les administrateurs doivent suivre ces règles

### Pour la branche `develop`

1. **Require pull request reviews before merging**
   - Nombre requis d'approbations : 1

2. **Require status checks to pass before merging**
   - Vérifications requises :
     - `backend-tests`
     - `frontend-tests`

3. **Require conversation resolution before merging**
   - Toutes les conversations doivent être résolues avant le merge

## Comment configurer ces règles

1. Allez sur le dépôt GitHub
2. Cliquez sur "Settings"
3. Dans le menu latéral, cliquez sur "Branches"
4. Dans la section "Branch protection rules", cliquez sur "Add rule"
5. Configurez les règles comme décrit ci-dessus pour chaque branche

## Workflow Git recommandé

Pour ce projet, nous recommandons le workflow Gitflow :

1. **Branches principales**
   - `main` : code de production
   - `develop` : code de développement intégré

2. **Branches de fonctionnalités**
   - Format : `feature/nom-de-la-fonctionnalité`
   - Créées à partir de : `develop`
   - Fusionnées dans : `develop`

3. **Branches de correction**
   - Format : `hotfix/nom-du-problème`
   - Créées à partir de : `main`
   - Fusionnées dans : `main` ET `develop`

4. **Branches de version**
   - Format : `release/x.y.z`
   - Créées à partir de : `develop`
   - Fusionnées dans : `main` ET `develop`

## Processus de Pull Request

1. Créez votre branche à partir de la branche appropriée
2. Développez et testez localement
3. Créez une Pull Request vers la branche cible
4. Attendez les revues de code et l'exécution des vérifications CI
5. Après approbation, fusionnez la Pull Request
