# Guide de déploiement

Ce document explique comment déployer l'application de gestion de tâches collaboratives en environnement de production.

## Prérequis

- Node.js 16.x ou supérieur
- MongoDB 4.4 ou supérieur
- Un serveur Linux (Ubuntu 20.04 LTS recommandé)
- Un nom de domaine configuré
- Certificat SSL (Let's Encrypt recommandé)

## Options de déploiement

Vous pouvez déployer l'application selon plusieurs méthodes :

### 1. Déploiement sur un serveur dédié/VPS

#### Configuration du serveur

```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation de Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installation de MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Installation de PM2 pour la gestion des processus
npm install pm2 -g
```

#### Déploiement de l'application

```bash
# Clonage du dépôt
git clone https://github.com/votre-nom/projet-gestion-taches.git
cd projet-gestion-taches

# Installation des dépendances
cd backend && npm install
cd ../frontend && npm install

# Construction du frontend
npm run build

# Configuration des variables d'environnement
cd ../backend
cp .env.example .env
# Éditez le fichier .env avec vos paramètres de production

# Démarrage des services avec PM2
pm2 start server.js --name "task-manager-backend"
pm2 save
pm2 startup
```

#### Configuration de Nginx comme proxy inverse

```bash
sudo apt install nginx -y

# Configurer Nginx
sudo nano /etc/nginx/sites-available/task-manager

# Insérer la configuration suivante
server {
    listen 80;
    server_name votreapp-taches.com www.votreapp-taches.com;

    location / {
        root /chemin/vers/projet-gestion-taches/frontend/build;
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Activer le site
sudo ln -s /etc/nginx/sites-available/task-manager /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Configuration SSL avec Certbot
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d votreapp-taches.com -d www.votreapp-taches.com
```

### 2. Déploiement sur Heroku

#### Préparation du projet

```bash
# Installation de l'outil Heroku CLI
npm install -g heroku

# Connexion à Heroku
heroku login

# Création de l'application
heroku create votre-app-taches

# Configuration de MongoDB Atlas (service cloud)
# Créez un cluster sur https://www.mongodb.com/cloud/atlas
# Récupérez l'URI de connexion

# Configuration des variables d'environnement
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=votre_secret_jwt
heroku config:set NODE_ENV=production
```

#### Déploiement

```bash
# Ajout d'un fichier Procfile à la racine du projet
echo "web: cd backend && node server.js" > Procfile

# Configuration de package.json à la racine
# Ajoutez un script "heroku-postbuild" pour construire le frontend

# Déploiement
git add .
git commit -m "Préparation pour Heroku"
git push heroku main
```

### 3. Déploiement sur AWS

#### Services requis

- EC2 pour le serveur
- RDS ou DocumentDB pour MongoDB (ou EC2 séparé)
- S3 pour stocker les ressources statiques
- CloudFront pour la distribution de contenu (optionnel)
- Route 53 pour la gestion DNS (optionnel)

#### Étapes de déploiement

1. Créez une instance EC2 (t2.micro pour commencer)
2. Configurez les groupes de sécurité pour ouvrir les ports 22, 80 et 443
3. Installez Node.js, MongoDB (ou configurez DocumentDB)
4. Clonez le dépôt et suivez les étapes similaires au déploiement sur un serveur dédié
5. Configurez un certificat SSL via AWS Certificate Manager
6. Mettez en place un équilibreur de charge si nécessaire pour une haute disponibilité

## Configuration CI/CD

Pour activer le déploiement continu, décommentez et configurez la section appropriée dans le fichier `.github/workflows/cd.yml` selon votre méthode de déploiement choisie.

## Surveillance et Maintenance

### Mise en place de la surveillance

```bash
# Installation des outils de surveillance
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 10

# Surveillance des logs
pm2 logs
```

### Configuration des sauvegardes MongoDB

```bash
# Créer un script de backup
mkdir -p /opt/backup/mongodb
nano /opt/backup/mongodb/backup.sh

# Contenu du script
#!/bin/bash
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_DIR="/opt/backup/mongodb"
mongodump --out "$BACKUP_DIR/$DATE"
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;

# Rendre le script exécutable
chmod +x /opt/backup/mongodb/backup.sh

# Ajouter au crontab pour une exécution quotidienne
crontab -e
# Ajouter la ligne:
0 1 * * * /opt/backup/mongodb/backup.sh >> /var/log/mongodb-backup.log 2>&1
```

## Résolution des problèmes courants

### Le backend ne démarre pas
- Vérifiez les logs : `pm2 logs task-manager-backend`
- Vérifiez la connexion à MongoDB : `mongo --eval "db.adminCommand('ping')"`
- Vérifiez les variables d'environnement : `cat .env`

### Erreurs 502 Bad Gateway
- Vérifiez que le backend est en cours d'exécution : `pm2 status`
- Vérifiez la configuration Nginx : `sudo nginx -t`
- Vérifiez les logs Nginx : `sudo tail -f /var/log/nginx/error.log`

### Problèmes de performances
- Surveillez l'utilisation des ressources : `htop`
- Vérifiez les performances de MongoDB : `mongo --eval "db.serverStatus()"`
- Considérez la mise à l'échelle de votre solution si nécessaire
