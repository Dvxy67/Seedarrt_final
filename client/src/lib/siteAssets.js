// Visuels de branding/mise en page fixes (logo, écran d'intro, modèle 3D du Hero,
// vidéo de la section Création) — hébergés sur Cloudinary plutôt qu'en fichiers
// statiques dans public/, pour ne rien embarquer de lourd dans le build déployé.
// Contrairement aux œuvres du Portfolio, ce contenu ne change quasiment jamais :
// pas besoin d'un CRUD dédié, une URL fixe suffit.

export const NAVBAR_LOGO_URL =
  'https://res.cloudinary.com/dvtv7bku4/image/upload/c_limit,f_auto,q_auto,w_400/v1/seedarrt/site/islgsjcftit2wko2bhwd'

export const HERO_LOGO_URL =
  'https://res.cloudinary.com/dvtv7bku4/image/upload/c_limit,f_auto,q_auto,w_1200/v1/seedarrt/site/i0iw3e0l9dao1e0ay6dr'

export const INTRO_IMAGE_URL =
  'https://res.cloudinary.com/dvtv7bku4/image/upload/c_limit,f_auto,q_auto,w_1600/v1/seedarrt/site/yc0e0grze4e6hqmig20k'

// Source : 1920x1080, ~3min14, ~2.1 Mbps, 52 Mo (vérifié via ffprobe) — chargée
// à résolution native, contrairement aux images (toutes en c_limit,w_1600
// ci-dessous). w_1280,q_auto:eco ramène à ~23 Mo. Couplé à preload="none" côté
// <video> (VideoStep, Creation.jsx) : plus aucun octet de la vidéo n'est
// demandé avant que l'utilisateur appuie sur lecture — c'est ça qui évitait le
// jank constaté à l'entrée en vue de l'étape "Animation" sur mobile, le poids
// du fichier ne joue qu'une fois la lecture lancée.
export const CREATION_VIDEO_URL =
  'https://res.cloudinary.com/dvtv7bku4/video/upload/f_auto,q_auto:eco,w_1280,c_limit/v1/seedarrt/site/rha2km6ecl9gemwxhutd'

// Frame extraite de la vidéo (via l'extension .jpg côté Cloudinary), utilisée
// comme poster : évite au navigateur de devoir décoder la vidéo elle-même
// juste pour afficher un aperçu avant lecture.
export const CREATION_VIDEO_POSTER_URL =
  'https://res.cloudinary.com/dvtv7bku4/video/upload/f_auto,q_auto,w_1280,c_limit,so_0/v1/seedarrt/site/rha2km6ecl9gemwxhutd.jpg'

export const HERO_MODEL_URL =
  'https://res.cloudinary.com/dvtv7bku4/raw/upload/v1/seedarrt/site/dlnhrejvf63ihlfnkhek.glb'

export const ABOUT_IMAGE_URL =
  'https://res.cloudinary.com/dvtv7bku4/image/upload/c_limit,f_auto,q_auto,w_1600/v1/seedarrt/site/c0agkmsgtywkd1eufuig'

// Fallback mobile de l'étape "Objet 3D" (le canvas 3D n'est pas tenté sur
// mobile, voir Creation.jsx).
export const CREATION_STEP_3D_IMAGE_URL =
  'https://res.cloudinary.com/dvtv7bku4/image/upload/c_limit,f_auto,q_auto,w_1600/v1/seedarrt/site/io8utlbuv8qytux81ssp'

// ~6% d'espace ajouté en haut à la source, comme CREATION_STEP_GRAPHISME_IMAGE_URL
// ci-dessous (voir NOTES-perf-grain-overlay.md pour l'historique) : à 100% de
// hauteur l'image touchait la navbar (fixe, superposée). Même traitement que
// Graphisme pour que les deux gardent une taille cohérente entre elles — ne
// réutilise donc plus directement l'œuvre du Portfolio, copie dédiée.
export const CREATION_STEP_PEINTURE_IMAGE_URL =
  'https://res.cloudinary.com/dvtv7bku4/image/upload/c_limit,f_auto,q_auto,w_1600/v1/seedarrt/site/fnv6tuqzcfyoqsmlktl4'

export const CREATION_STEP_GRAPHISME_IMAGE_URL =
  'https://res.cloudinary.com/dvtv7bku4/image/upload/c_limit,f_auto,q_auto,w_1600/v1/seedarrt/site/ihy1yw2gipazrciridb2'

// Modèle compressé (gltfpack -cc -vtf, meshopt). Le fichier source (exporté
// depuis Nomad Sculpt) contenait des morph targets résiduels (poids à 0,
// restes de l'historique de sculpture) dont les métadonnées "targetNames"
// cassaient à la fois gltfpack et le shader Three.js (vColor indéfini) —
// retirés avant compression avec @gltf-transform/core. UV en flottant pour
// éviter KHR_texture_transform (idem, casse la compilation du vertex shader).
// 14.8 Mo → 2.8 Mo, sous la limite Cloudinary (10 Mo/fichier raw). Utilisé
// par l'étape "Objet 3D" de Création (indépendant du modèle du Hero,
// HERO_MODEL_URL).
export const CREATION_STEP_3D_MODEL_URL =
  'https://res.cloudinary.com/dvtv7bku4/raw/upload/v1/seedarrt/site/ydpz2zdjnot6dbvvwqq0'
