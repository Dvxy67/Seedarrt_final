require('dotenv').config()
const path = require('path')
const fs = require('fs')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const contactRouter = require('./routes/contact')
const authRouter = require('./routes/auth')
const worksRouter = require('./routes/works')
const newsletterRouter = require('./routes/newsletter')
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler')

const app = express()
const PORT = process.env.PORT || 3001

// CSP par défaut de helmet restreint img-src/media-src/style-src à 'self' —
// bloquerait toutes les images/vidéos Cloudinary et la police Google Fonts
// une fois que ce serveur sert aussi le HTML du client (voir static serving
// ci-dessous). Élargi explicitement plutôt que désactivé.
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'blob:', 'https://res.cloudinary.com'],
      mediaSrc: ["'self'", 'https://res.cloudinary.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
      // Le décodeur Draco/meshopt des modèles .glb compressés a besoin de
      // WebAssembly ('wasm-unsafe-eval') et s'amorce via un <script> inline
      // injecté au runtime ('unsafe-inline') — propre à ce pipeline de
      // chargement 3D, pas une inline classique évitable.
      scriptSrc: ["'self'", "'unsafe-inline'", "'wasm-unsafe-eval'"],
      workerSrc: ["'self'", 'blob:'],
      // 'self' seul bloquait les fetch() JS de Three.js : vers les modèles
      // .glb Cloudinary, vers les blob: internes générés pendant le décodage
      // des textures, et vers la texture d'environnement HDRI par défaut de
      // Drei (hébergée sur raw.githack.com). Ces erreurs non rattrapées
      // faisaient planter tout le rendu React (page entièrement noire).
      connectSrc: [
        "'self'", 'blob:', 'https://res.cloudinary.com',
        // raw.githack.com (texture HDRI par défaut de Drei) redirige vers
        // raw.githubusercontent.com — les deux doivent être autorisés.
        'https://raw.githack.com', 'https://raw.githubusercontent.com',
      ],
    },
  },
}))
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
}))
app.use(express.json())

app.use('/api/contact', contactRouter)
app.use('/api/auth', authRouter)
app.use('/api/works', worksRouter)
app.use('/api/newsletter', newsletterRouter)

// Sert le build du client (client/dist) — un seul service pour le front et
// l'API en production (pas de proxy Vite en dehors du dev). Le dossier
// n'existe qu'après `npm run build` : ignoré silencieusement s'il est absent
// (dev local sans build), pour ne pas planter au démarrage.
const clientDist = path.join(__dirname, '../../client/dist')
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist))
  app.get(/^(?!\/api\/).*/, (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'))
  })
}

app.use(notFoundHandler)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
