# ft_transcendence 🎮

<div align="center">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white" alt="Fastify" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Babylon.js-FD5750?style=for-the-badge&logo=babylon.js&logoColor=white" alt="Babylon.js" />
</div>

## 📝 Description

**ft_transcendence** est le projet final du tronc commun de l'École 42 - une plateforme web complète de jeu Pong multijoueur avec des fonctionnalités modernes d'authentification, de jeu en remote en temps réel et de rendu 3D.

## 🎯 Objectifs du Projet

- Développer une application web full-stack complexe
- Implémenter une architecture sécurisée avec authentification JWT
- Maîtriser les WebSockets pour le temps réel
- Orchestrer une infrastructure complète avec Docker
- Créer une expérience utilisateur moderne et responsive

## 🛠️ Technologies Utilisées

### Backend
- **Node.js** avec **Fastify** - API REST haute performance
- **TypeScript** - Typage statique et développement robuste
- **SQLite** - Base de données légère et efficace
- **JWT** - Authentification sécurisée
- **WebSocket** - Communication temps réel

### Frontend
- **HTML5/CSS3** - Structure et design
- **Tailwind CSS** - Framework CSS utilitaire
- **Babylon.js** - Rendu 3D pour le jeu
- **Vite** - Build tool moderne

### DevOps & Outils
- **Docker** & **Docker Compose** - Conteneurisation
- **Nginx** - Reverse proxy et serveur web
- **ESLint** - Qualité de code
- **Dotenv** - Gestion des variables d'environnement

## 🚀 Installation & Lancement

### Prérequis
```bash
# Versions requises
Docker >= 20.10
Docker Compose >= 2.0
Make
```

### Démarrage rapide
```bash
# Cloner le repository
git clone https://github.com/alesshardy/ft_transcendence.git
cd ft_transcendence

# Lancer l'application en production
make prod

# Accéder à l'application
open https://localhost:8443
```

### Commandes Make disponibles
```bash
make prod     # Lance l'environnement de production
make dev      # Lance l'environnement de développement
make clean    # Nettoie les conteneurs et volumes
make fclean   # Nettoyage complet
make re       # Rebuild complet
```

## 📋 Fonctionnalités Principales

### 🔐 Authentification Sécurisée
- **JWT Authentication** - Tokens sécurisés
- **OAuth2 Integration** - Connexion via 42 API
- **Two-Factor Authentication (2FA)** - Sécurité renforcée
- **Gestion des sessions** - Persistance utilisateur

### 🎮 Jeu Pong Multijoueur
- **Mode temps réel** - WebSocket pour la synchronisation
- **Matchmaking** - Système de recherche d'adversaire
- **Historique des parties** - Statistiques et classements

### 🎨 Interface 3D
- **Rendu Babylon.js** - Graphismes modernes
- **Animations fluides** - Expérience immersive
- **Responsive design** - Compatible mobile/desktop

## 🏗️ Architecture

```
ft_transcendence/
├── frontend/          # Interface utilisateur
│   ├── src/
│   ├── public/
│   └── vite.config.ts
├── backend/           # API Fastify
│   ├── src/
│   ├── database/
│   └── package.json
├── nginx/             # Configuration reverse proxy
├── Makefile          # Commandes de gestion
└── docker-compose.yml # Orchestration
```

## 🏆 Compétences Acquises

- **Architecture Full-Stack** - Conception d'applications complètes
- **Sécurité Web** - Authentification JWT, OAuth2, 2FA
- **Temps Réel** - WebSockets et synchronisation
- **DevOps** - Docker, orchestration multi-conteneurs
- **3D Web** - Intégration Babylon.js
- **Qualité de Code** - TypeScript, ESLint, bonnes pratiques

## 🎯 Défis Techniques Relevés

- **Synchronisation temps réel** du jeu entre clients
- **Gestion des états** complexes (authentification, parties)
- **Sécurisation complète** de l'API et des communications
- **Performance** - Optimisation du rendu 3D
- **Scalabilité** - Architecture modulaire et conteneurisée

---

*Projet réalisé dans le cadre du cursus 42 Paris - Démonstration de maîtrise du développement web moderne*
