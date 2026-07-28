# ✅ Check-list Étape par Étape — TFE Développement Web

Voici une checklist étape par étape pour vous aider à structurer et mener à bien votre projet de fin d'études.

## 🧠 Phase 1: planification et conception

### 📐 Analyse des besoins

- [ ] Identifier les fonctionnalités obligatoires du front et back office
- [ ] Établir les user stories et les priorités, retranscrire dans un outil gestion (Trello, Notion, ...)
- [ ] Choisir ses outils: ORM (Mongoose/Prisma), state manager, UI kit, middlewares etc.

### 📐 Conception de l'architecture

- [ ] Dessiner l'architecture globale (client React, API Express, base de données)
- [ ] Modéliser la base de données (diagramme ou équivalent)
- [ ] Définir la structure des dossiers pour le client et l'API
- [ ] Rédifer une spécification des routes API RESTful (GET, POST, PUT, DELETE)
- [ ] Définir les rôles utilisateurs (et leurs accès)

### 📐 Conception des wireframes et du design

- [ ] Créer des *wireframes pour toutes les pages principales
- [ ] Établir une charte graphique (couleurs, typographie, composants UI, UI kits)
- [ ] Concevoir des maquettes responsive

### 📐 Versionning Git

- [ ] Initialiser un mono-repo Git (README, .gitignore, conventions de commits)
- [ ] Créer des branches `main` (suggestion: Gitlab flow avec `dev`, `staging`, `production`)
- [ ] Créer des branches `feature` au fur et à mesure des développements
- [ ] Mettre en place l’architecture principale des dossiers (client et server)

## 🧪 Phase 2: développement côté serveur (Express + ORM/ODM)

### ⚙️ Installation et configuration de l'API

- [ ] Initialiser le projet `server` avec `npm init -y`
- [ ] Installer et configurer `nodemon` + script npm
- [ ] Installer et configurer `eslint` + script npm
- [ ] Mettre en place une architecture en couches ou DDD
- [ ] Installer et configurer Express.js avec la structure appropriée
- [ ] Configurer les variables d'environnement (port, connexion db, logs, jwt secret, jwt expiration, ...)

### ⚙️ Configuration de la base de données

- [ ] Installer et configurer l'ORM/ODM (Mongoose, Sequelize, Prisma, etc.)
- [ ] Créer les schémas et modèles
- [ ] Mettre en place les validations au niveau du modèle

### 🔁 API REST

- [ ] Implémenter les routes REST et contrôleurs (CRUD) pour les entités
- [ ] Implémenter les filtres et paginations sur les routes GET
- [ ] Implémenter un middleware de gestion des erreurs (codes HTTP cohérents)
- [ ] Implémenter les endpoints pour la gestion des utilisateurs (CRUD, export CSV)
- [ ] Implémenter les endpoints pour les statistiques du dashboard (comptes, filtres, agrégations)

### 🔒 Authentification & sécurité

- [ ] Créer les routes `/auth/register`, `/auth/login`
- [ ] Implémenter la délivrance d'un JWT via `/auth/register` et `/auth/login`
- [ ] Implémenter un middleware de protection des routes (authentification, rôles)
- [ ] Implémenter les middleware CORS et de sécurité (XSS, rate-limit, pollution params, etc.)
- [ ] Implémenter la validation des entrées avec des schémas

### 📈 Optimisation des performances

- [ ] Optimiser les requêtes à la base de données
- [ ] Mettre en place le système de cache si nécessaire
- [ ] Configurer la pagination pour les listes

## ⚛️ Phase 3: développement du client React

### ⚙️ Installation et configuration du client

- [ ] Installer React avec Vite
- [ ] Configurer ESLint
- [ ] Installer les librairies requises (react-hook-form, Material UI, ...)
- [ ] Implémenter un thème personnalisé
- [ ] Implémenter un layout de base

### 🚦 Routing & navigation

- [ ] Implémenter `React Router` (pages publiques / privées)
- [ ] Mettre en place une navigation claire (menu, liens actifs, 404)

### 🔒 Authentification

- [ ] Créer les formulaires d'authentification (register, login), avec validation
- [ ] Mettre en place les redirections après login / logout / erreurs
- [ ] Gérer l'authentification côté client (JWT token, Authorization headers, sessionStorage)

### 📁 Fonctionnalités front-office attendues

- [ ] Implémenter l'authentification / inscription / autorisation
- [ ] Implémenter la recherche avancée (mots-clés, filtres)
- [ ] Implémenter un upload d’images
- [ ] Implémenter un CRUD sur les contenus (avec validations et gestion d'erreurs)
- [ ] Implémenter un formulaire de contact (avec validation et gestion d'erreurs)

### 📁 Fonctionnalités back-office attendues

- [ ] Implémenter le dashboard avec statistiques
- [ ] Implémenter la gestion des utilisateurs
- [ ] Implémenter la fonctionnalité d'export (CSV)

### 🧩 Composants & states

- [ ] Créer des composants réutilisables (cards, modales, etc.)
- [ ] Utiliser des props et hooks (`useState`, `useEffect`, `useMemo`)
- [ ] Créer des hooks personnalisés si besoin (`useFetch`, `useAtuh`, ...)
- [ ] Implémenter un state partagé pour l'authentification (via l'API Contexte)

### 🎨 UI / UX

- [ ] Intégrer la charte graphique
- [ ] Implémenter le design responsive (mobile, tablette, desktop)
- [ ] Gérer les états de chargement et les erreurs
- [ ] Assurer la cohérence visuelle entre les composants

### 📈 Optimisation des performances côté front-end

- [ ] Optimiser les images et assets
- [ ] Mettre en place le lazy loading des composants
- [ ] Minimiser les re-rendus inutiles (useMemo, useCallback)

## 🧹 Phase 4: finalisation & livrables

### 📚 Documentation

- [ ] Rédiger un README clair: installation, architecture, commandes
- [ ] Documenter l'API (endpoints, paramètres, réponses)
- [ ] Détailler le workflow Git (branches, merge requests)

### 🌿 Green IT

- [ ] Optimiser les images et assets
- [ ] Charger les ressources en différé (lazy loading si pertinent)
- [ ] Réaliser un test avec [Ecoindex](https://www.ecoindex.fr/)
- [ ] Analyser les résultats et documenter les améliorations possibles

## 🚀 Phase 5: déploiement

- [ ] Configurer les scripts de build
- [ ] Préparer les fichiers statiques pour le déploiement
- [ ] Déployer le client front (Vercel ou Render)
- [ ] Déployer l’API (Render)
- [ ] Créer et assigner des noms de domaine customisés (ie api.project.efp-be)
- [ ] Créer les CNAMES records fournis par l'hébergeur
- [ ] Fichier `.env.example` pour la configuration

## 🧑‍🎓 Phase 6: préparation de la soutenance & démo

- [ ] Effectuer des tests manuels cross-browser
- [ ] Tester l'application sur différents appareils
- [ ] Fournir un lien de démo
- [ ] Préparer une démonstration des fonctionnalités clés
- [ ] Identifier les points forts et les choix techniques à mettre en avant

## 💡 Bonus possible (1 seul sera comptabilisé)

- [ ] Store avancé (Redux, Zustand, etc.)
- [ ] Tests E2E ou unitaires
- [ ] Websockets en temps réel
- [ ] Paiement en ligne
- [ ] Documentation interactive
