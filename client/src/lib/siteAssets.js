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

export const CREATION_VIDEO_URL =
  'https://res.cloudinary.com/dvtv7bku4/video/upload/f_auto,q_auto/v1/seedarrt/site/rha2km6ecl9gemwxhutd'

export const HERO_MODEL_URL =
  'https://res.cloudinary.com/dvtv7bku4/raw/upload/v1/seedarrt/site/dlnhrejvf63ihlfnkhek.glb'

// Ces trois visuels réutilisent des œuvres déjà publiées dans le Portfolio
// (mêmes fichiers Cloudinary) plutôt que de dupliquer des exports séparés.
export const ABOUT_IMAGE_URL =
  'https://res.cloudinary.com/dvtv7bku4/image/upload/c_limit,f_auto,q_auto,w_1600/v1/seedarrt/hsnlvdk4odjtat1p8iig'

export const CREATION_STEP_3D_IMAGE_URL =
  'https://res.cloudinary.com/dvtv7bku4/image/upload/c_limit,f_auto,q_auto,w_1600/v1/seedarrt/m0hrokyibsi6s52mnfpd'

export const CREATION_STEP_PEINTURE_IMAGE_URL =
  'https://res.cloudinary.com/dvtv7bku4/image/upload/c_limit,f_auto,q_auto,w_1600/v1/seedarrt/kkr921ndjvbmyllysy45'

export const CREATION_STEP_GRAPHISME_IMAGE_URL =
  'https://res.cloudinary.com/dvtv7bku4/image/upload/c_limit,f_auto,q_auto,w_1600/v1/seedarrt/site/rkpu2lt5ood30raqmb5x'

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
