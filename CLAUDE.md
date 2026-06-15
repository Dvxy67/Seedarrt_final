# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install all dependencies (run once)
npm run install:all

# Start both client (port 5173) and server (port 3001) in parallel
npm run dev

# Client only
npm run dev:client

# Server only
npm run dev:server

# Production build (client only — server runs as-is)
npm run build

# Preview the production build locally
cd client && npm run preview
```

## Architecture

```
Seedarrt_final/
├── client/                          # Vite + React SPA (ESM — "type": "module")
│   ├── public/
│   │   └── works/                   # Drop artwork images here (jpg/png/webp)
│   └── src/
│       ├── components/
│       │   ├── Navbar/              # Fixed top nav with scroll-aware background
│       │   ├── Hero/                # Full-viewport hero + 3D canvas
│       │   ├── Portfolio/           # Filterable grid (Peinture / 3D / Graphisme)
│       │   ├── About/               # Two-column bio section
│       │   ├── Contact/             # Form → POST /api/contact + footer
│       │   └── three/
│       │       └── ArtScene.jsx     # The only Three.js scene in the app
│       └── styles/
│           └── globals.css          # CSS custom properties (design tokens)
└── server/                          # Express API (CommonJS — require/module.exports)
    └── src/
        ├── index.js                 # Entry point — cors, json, mounts routes
        └── routes/contact.js        # POST /api/contact → nodemailer
```

**Single-page scroll layout** — no React Router. Navigation uses anchor links (`#portfolio`, `#about`, `#contact`). The Vite dev server proxies `/api/*` to `http://localhost:3001`.

**Module systems differ**: the client uses ESM (`import`/`export`), the server uses CommonJS (`require`/`module.exports`). Don't mix them.

## Animations

All UI animations use **Framer Motion** (`framer-motion`): scroll-triggered reveals (`whileInView`), layout transitions for the portfolio filter (`layout` + `AnimatePresence`), and entrance animations. The 3D canvas has its own animation loop via R3F's `useFrame`.

## Design system

All design tokens live in `client/src/styles/globals.css` as CSS custom properties:

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#080808` | Page background |
| `--color-text` | `#f0ede8` | Primary text |
| `--color-text-muted` | `#7a776f` | Secondary text, labels |
| `--color-accent` | `#b8975a` | Gold accent — CTAs, labels, borders |
| `--font-display` | Cormorant Garamond | Headings, titles |
| `--font-body` | DM Sans | Body text, UI labels |
| `--spacing-section` | `12rem` (6rem mobile) | Vertical section padding |

Each component has its own `.module.css` file co-located next to the `.jsx`. Do not use global class names outside of `globals.css`.

## 3D scene (`ArtScene.jsx`)

The canvas is positioned `absolute inset-0` inside the Hero section with `alpha: true` so the dark CSS background shows through. The scene contains a single `<Sculpture>` component: an icosahedron with `MeshDistortMaterial` (inner mesh) and a low-poly wireframe overlay. Mouse parallax is driven via R3F's `useFrame` + `pointer` state. A `Bloom` post-processing effect from `@react-three/postprocessing` adds glow.

**Adding the artist's own 3D models** — use Drei's `useGLTF` hook:

```jsx
import { useGLTF } from '@react-three/drei'

function ArtistWork() {
  const { scene } = useGLTF('/models/piece.glb')
  return <primitive object={scene} />
}
```

Drop `.glb` files in `client/public/models/`. Keep file sizes under 5 MB for web performance.

## Adding artwork to the portfolio

In `Portfolio.jsx`, edit the `works` array. Set `src` to a path relative to `client/public/` (or `null` to show a placeholder):

```js
{ id: 1, title: 'Titre', category: 'Peinture', year: '2025', aspect: 'portrait', src: '/works/painting-01.jpg' }
```

`aspect` controls the thumbnail ratio: `portrait` (3/4) · `square` (1/1) · `landscape` (4/3).

## Email contact form

The server uses nodemailer. Copy `server/.env.example` to `server/.env` and fill in SMTP credentials before the contact form will work. `CONTACT_EMAIL` is where messages are delivered; `CLIENT_URL` controls the CORS origin in production. The form degrades gracefully if the server is unreachable (shows an error message client-side).
