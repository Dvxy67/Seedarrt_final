# Seedarrt — Portfolio d'artiste & back-office

Site vitrine d'une artiste pluridisciplinaire (peinture, sculpture numérique 3D, graphisme, animation),
accompagné d'un back-office qui lui permet de gérer seule ses œuvres — sans toucher au code.

Single-page scrollée côté public, dashboard protégé côté privé, une seule API Express pour les deux.

**Démo en ligne** : [seedarrt.onrender.com](https://seedarrt.onrender.com/) · **Back-office** : [/admin](https://seedarrt.onrender.com/admin)

---

## Sommaire

- [Aperçu fonctionnel](#aperçu-fonctionnel)
- [Stack technique](#stack-technique)
- [Architecture](#architecture)
- [Points techniques notables](#points-techniques-notables)
- [API](#api)
- [Installation locale](#installation-locale)
- [Variables d'environnement](#variables-denvironnement)
- [Déploiement](#déploiement)
- [Choix assumés & limites](#choix-assumés--limites)

---

## Aperçu fonctionnel

### Côté public

| Section | Rôle |
|---|---|
| **Intro** | Écran d'entrée joué une seule fois (mémorisé en `localStorage`) |
| **Hero** | Logo + modèle 3D temps réel (React Three Fiber) |
| **Création** | Narration scrollée en 4 étapes — objet 3D interactif, peinture, graphisme, animation vidéo |
| **Portfolio** | Grille masonry filtrable par catégorie, alimentée par l'API |
| **À propos** | Bio avec interpolation de couleur pilotée au scroll |
| **Contact** | Formulaire → e-mail SMTP, avec dégradation gracieuse si l'API est injoignable |
| **Newsletter** | Collecte d'adresses, anti-doublon |

### Côté back-office (`/admin`)

- **Authentification** JWT, mot de passe hashé bcrypt, rate limiting sur le login
- **Galerie** : CRUD complet des œuvres — upload image **et** modèle `.glb`, brouillon/publié, recherche, filtre par catégorie, vue grille ou liste
- **Réordonnancement** manuel des œuvres (l'ordre se reflète immédiatement sur le site public)
- **Newsletter** : liste des abonnés, désinscription, export CSV

---

## Stack technique

**Client** — React 18 · Vite 5 · CSS Modules
**3D** — Three.js · React Three Fiber · Drei · Postprocessing
**Animation** — Framer Motion · GSAP (ScrollTrigger, ScrollToPlugin, Flip) · Lenis (smooth scroll)
**Serveur** — Node.js · Express 4 · Prisma 6 · SQLite
**Sécurité** — Helmet (CSP explicite) · JWT · bcrypt · Zod · express-rate-limit
**Médias** — Cloudinary (images, vidéo, modèles 3D) via Multer
**Déploiement** — Render (Blueprint `render.yaml`)

Le client est en **ESM**, le serveur en **CommonJS** — les deux systèmes de modules ne se mélangent pas.

---

## Architecture

Un seul service en production : Express sert l'API **et** le build statique du client. Le front appelle
donc l'API en chemin relatif (`fetch('/api/works')`), ce qui évite une seconde origine et tout le CORS
qui va avec. En développement, le proxy Vite redirige `/api/*` vers `localhost:3001`.

```
Seedarrt_final/
├── client/                        # SPA Vite + React (ESM)
│   └── src/
│       ├── App.jsx                # Site public — layout scrollé, pas de router
│       ├── main.jsx               # Aiguillage public / admin sur window.location.pathname
│       ├── admin/                 # Back-office : Login, Dashboard, Gallery, Newsletter, PieceDrawer
│       ├── components/
│       │   ├── Intro/ Hero/ Creation/ Portfolio/ About/ Contact/ Newsletter/ Footer/ Navbar/
│       │   ├── GrainOverlay/      # Grain animé plein écran
│       │   ├── three/             # ArtScene (sculpture procédurale), ModelViewer (.glb)
│       │   └── ui/RevealText.jsx
│       ├── hooks/                 # useLenis, useInView, useIsMobile
│       ├── lib/siteAssets.js      # URLs Cloudinary des visuels fixes (logo, intro, vidéo…)
│       └── styles/globals.css     # Tokens de design (CSS custom properties)
└── server/                        # API Express (CommonJS)
    ├── prisma/
    │   ├── schema.prisma          # Admin · Work · Subscriber
    │   ├── migrations/            # 5 migrations versionnées
    │   └── seed.js                # Crée le compte admin initial
    └── src/
        ├── index.js               # Helmet + CORS + routes + service du build client
        ├── routes/                # contact · auth · works · newsletter
        ├── schemas/               # Validation Zod des payloads
        ├── middleware/            # requireAuth (JWT) · errorHandler centralisé
        └── lib/                   # prisma · jwt · cloudinary
```

### Modèle de données

```prisma
Admin       { email unique, passwordHash, createdAt }
Work        { title, category, year, description, published,
              imageUrl, imagePublicId, modelUrl, modelPublicId,
              order, createdAt, updatedAt }
Subscriber  { email unique, active, origin, createdAt }
```

Les `publicId` Cloudinary sont stockés à côté des URLs : c'est ce qui permet de **supprimer réellement
le média distant** quand une œuvre est supprimée ou son image remplacée, au lieu de laisser des fichiers
orphelins s'accumuler.

---

## Points techniques notables

Les problèmes qui ont demandé une vraie décision technique, et ce qui a été retenu.

### CSP durcie sans casser le pipeline 3D

La CSP par défaut de Helmet bloquait tout : images Cloudinary, Google Fonts, et surtout le chargement
des `.glb`. Plutôt que de désactiver la directive, chaque élargissement est explicite et commenté dans
`server/src/index.js` :

- `'wasm-unsafe-eval'` — le décodeur Draco/meshopt est un module WebAssembly
- `connect-src: blob:` — Three.js `fetch()` des blobs internes pendant le décodage des textures
- `raw.githack.com` **et** `raw.githubusercontent.com` — l'HDRI par défaut de Drei redirige de l'un vers l'autre

Sans ces trois points, une exception non rattrapée dans le loader faisait tomber tout le rendu React :
page entièrement noire en production, alors que le dev local fonctionnait.

### GSAP et Framer Motion dans le même projet

Les deux librairies sont utilisées, mais **jamais sur le même nœud DOM** — sinon l'une écrase les styles
inline de l'autre. Framer Motion gère les révélations au scroll, les transitions de montage et les
entrées ; GSAP prend ce que Framer ne sait pas faire :

- `ScrollTrigger` — effets pilotés au scroll non triviaux (interpolation de couleur, rail de progression)
- `ScrollToPlugin` — le scroll fluide du stepper de la section Création
- `Flip` — le reflow de la grille masonry au changement de filtre : la grille est en CSS `columns`, que
  la prop `layout` de Framer ne sait pas diffuser

### Recalcul des positions de scroll après chargement des images

Le poids des images décale la hauteur de page **après** que GSAP a calculé ses positions de scroll —
visible surtout sur mobile. `ScrollTrigger.refresh()` est donc appelé à 300 ms, à 1200 ms, puis sur
l'événement `load` réel de la fenêtre.

### Budget média maîtrisé

Toutes les URLs Cloudinary portent leurs transformations (`f_auto`, `q_auto`, `c_limit,w_1600`), donc
aucun média lourd n'est embarqué dans le build. Exemple chiffré : la vidéo de la section Création pèse
52 Mo en source (1920×1080, ~2,1 Mbps) ; `w_1280,q_auto:eco` la ramène à ~23 Mo, et `preload="none"`
garantit qu'**aucun octet** n'est demandé avant que l'utilisateur appuie sur lecture. C'est ce dernier
point qui a supprimé le jank à l'entrée en vue de l'étape « Animation ».

### Dégradation 3D sur mobile

Le canvas 3D de la section Création n'est pas tenté sur mobile (`useIsMobile`) : une image de fallback
Cloudinary est servie à la place. Les modèles `.glb` sont optimisés en amont (meshopt + quantize).

---

## API

Base : `/api`. 🔒 = `Authorization: Bearer <jwt>` requis.

| Méthode | Route | Rôle |
|---|---|---|
| `POST` | `/contact` | Envoie le message du formulaire par SMTP |
| `POST` | `/auth/login` | Connexion admin (rate-limitée) |
| `POST` | `/auth/register` | Création du compte admin — verrouillé après le premier |
| `GET` | `/works` | Œuvres publiées, triées par `order` (public) |
| `GET` | `/works/all` | 🔒 Toutes les œuvres, brouillons inclus |
| `POST` | `/works` | 🔒 Création — upload image + `.glb` (multipart) |
| `PATCH` | `/works/:id` | 🔒 Modification, remplacement de média inclus |
| `DELETE` | `/works/:id` | 🔒 Suppression + nettoyage des médias Cloudinary |
| `POST` | `/works/reorder` | 🔒 Réordonnancement par liste d'ids |
| `POST` | `/newsletter` | Inscription (public) |
| `GET` | `/newsletter` | 🔒 Liste des abonnés |
| `POST` | `/newsletter/unsubscribe` | 🔒 Désinscription |
| `GET` | `/newsletter/export.csv` | 🔒 Export CSV |

Tous les payloads sont validés par Zod (`server/src/schemas/`), et les erreurs remontent via un
`errorHandler` centralisé.

---

## Installation locale

Prérequis : Node.js ≥ 18, un compte Cloudinary, un accès SMTP.

```bash
# 1. Dépendances (racine + client + serveur)
npm run install:all

# 2. Configuration
cp server/.env.example server/.env   # puis remplir les valeurs

# 3. Base de données
cd server
npx prisma migrate dev
npm run seed                         # crée le compte admin initial
cd ..

# 4. Lancement — client sur :5173, serveur sur :3001
npm run dev
```

Autres scripts :

```bash
npm run dev:client      # client seul
npm run dev:server      # serveur seul (nodemon)
npm run build           # build de production du client
cd client && npm run preview
```

Le serveur Vite écoute sur `0.0.0.0` : le site est joignable depuis un téléphone sur le même Wi-Fi, ce
qui a servi à tester les performances 3D et le scroll sur vrai mobile.

---

## Variables d'environnement

`server/.env` — voir `server/.env.example`.

| Variable | Rôle |
|---|---|
| `PORT` | Port du serveur (défaut `3001`) |
| `CLIENT_URL` | Origine autorisée par CORS |
| `DATABASE_URL` | Chemin SQLite (`file:./dev.db`) |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | Signature et durée de vie des tokens |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | Transport e-mail |
| `CONTACT_EMAIL` | Destinataire des messages du formulaire |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Hébergement des médias |

---

## Déploiement

Render, via le Blueprint `render.yaml` : **New +** → **Blueprint** → sélectionner le repo.

- Build : `npm run install:all && prisma generate && npm run build`
- Start : `prisma migrate deploy && node server/src/index.js`
- Un disque persistant monté sur `/var/data` héberge le fichier SQLite — sans lui, la base serait perdue
  à chaque redéploiement
- Les secrets sont en `sync: false` : saisis à la main dans le dashboard Render, rien n'est commité
- `CLIENT_URL` se renseigne après le premier déploiement, une fois l'URL publique connue

---

## Choix assumés & limites

**SQLite plutôt que PostgreSQL** — un site vitrine avec une seule administratrice et quelques dizaines
d'œuvres n'a aucun besoin de concurrence en écriture. Le disque persistant Render suffit, et le passage
à Postgres se réduirait au `provider` Prisma et au `DATABASE_URL`.

**Pas de React Router** — le site public est une page scrollée, l'admin est la seule autre « page ».
`main.jsx` aiguille sur `window.location.pathname`, et Express renvoie `index.html` pour toute route
non-`/api`. Une dépendance de moins pour un besoin qui ne la justifie pas.

**`/auth/register` verrouillé après le premier compte** — il n'y a qu'une administratrice : pas de
gestion de rôles, pas d'invitations, pas de réinitialisation de mot de passe par e-mail.

**Pas de suite de tests automatisés** — la validation s'est faite manuellement, sur desktop et sur mobile
réel. C'est la première chose à ajouter si le projet devait grossir.
