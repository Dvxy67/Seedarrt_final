const { v2: cloudinary } = require('cloudinary')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Livre une image plafonnée à `width` (jamais agrandie — crop 'limit') plutôt
// que la résolution originale de l'upload, pour ne pas faire télécharger/décoder
// des photos de plusieurs Mo là où seule une vignette ou un aperçu est affiché.
cloudinary.buildDeliveryUrl = (publicId, width) =>
  cloudinary.url(publicId, {
    secure: true,
    quality: 'auto',
    fetch_format: 'auto',
    width,
    crop: 'limit',
  })

module.exports = cloudinary
