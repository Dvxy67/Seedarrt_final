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
