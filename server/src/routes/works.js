const express = require('express')
const multer = require('multer')
const prisma = require('../lib/prisma')
const cloudinary = require('../lib/cloudinary')
const requireAuth = require('../middleware/requireAuth')
const { workSchema, workUpdateSchema, reorderSchema } = require('../schemas/work')

const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
})

const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'model', maxCount: 1 },
])

// Largeurs de livraison : vignette de grille (portfolio + admin) vs aperçu
// grand format (lightbox). L'asset original reste stocké intact sur Cloudinary
// sous imagePublicId — ces plafonds ne s'appliquent qu'à l'URL de livraison.
const THUMB_WIDTH = 1000
const FULL_WIDTH = 1600

async function uploadImage(file) {
  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
  const uploaded = await cloudinary.uploader.upload(dataUri, { folder: 'seedarrt' })
  const imageUrl = cloudinary.buildDeliveryUrl(uploaded.public_id, THUMB_WIDTH)
  return { imageUrl, imagePublicId: uploaded.public_id }
}

// Recalcule les URLs de livraison depuis imagePublicId plutôt que de renvoyer
// imageUrl tel que stocké en base : ça plafonne aussi la taille des œuvres déjà
// existantes sans avoir à les ré-uploader.
function withDeliveryUrls(work) {
  if (!work.imagePublicId) return { ...work, imageUrlFull: work.imageUrl }
  return {
    ...work,
    imageUrl: cloudinary.buildDeliveryUrl(work.imagePublicId, THUMB_WIDTH),
    imageUrlFull: cloudinary.buildDeliveryUrl(work.imagePublicId, FULL_WIDTH),
  }
}

// Les .glb ne sont ni une image ni une vidéo pour Cloudinary : resource_type
// 'raw' les stocke et les sert tels quels (mêmes stockage/CDN, pas de transformation).
async function uploadModel(file) {
  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
  const uploaded = await cloudinary.uploader.upload(dataUri, {
    folder: 'seedarrt/models',
    resource_type: 'raw',
  })
  return { modelUrl: uploaded.secure_url, modelPublicId: uploaded.public_id }
}

// Public : liste des œuvres publiées, triée par `order`, avec filtre optionnel par catégorie.
router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query
    const works = await prisma.work.findMany({
      where: { published: true, ...(category ? { category } : {}) },
      orderBy: { order: 'asc' },
    })
    res.json(works.map(withDeliveryUrls))
  } catch (err) {
    next(err)
  }
})

// Protégé : liste complète (publiées + brouillons) pour le dashboard.
router.get('/all', requireAuth, async (req, res, next) => {
  try {
    const works = await prisma.work.findMany({ orderBy: { order: 'asc' } })
    res.json(works.map(withDeliveryUrls))
  } catch (err) {
    next(err)
  }
})

// Protégé : création. Accepte soit un fichier (upload Cloudinary), soit une image déjà
// existante (imageUrl/imagePublicId) — ce second chemin sert à "Annuler" après une
// suppression, sans avoir à ré-uploader le fichier perdu au moment du delete.
router.post('/', requireAuth, uploadFields, async (req, res, next) => {
  try {
    const parsed = workSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: 'Données invalides' })
    }

    const imageFile = req.files?.image?.[0]
    let image
    if (imageFile) {
      image = await uploadImage(imageFile)
    } else if (req.body.imageUrl) {
      image = { imageUrl: req.body.imageUrl, imagePublicId: req.body.imagePublicId || null }
    } else {
      return res.status(400).json({ error: 'Image requise' })
    }

    const modelFile = req.files?.model?.[0]
    let model = {}
    if (modelFile) {
      model = await uploadModel(modelFile)
    } else if (req.body.modelUrl) {
      model = { modelUrl: req.body.modelUrl, modelPublicId: req.body.modelPublicId || null }
    }

    const order = await prisma.work.count()
    const work = await prisma.work.create({
      data: { ...parsed.data, ...image, ...model, order },
    })

    res.status(201).json(work)
  } catch (err) {
    next(err)
  }
})

// Protégé : édition partielle, avec remplacement d'image optionnel.
router.patch('/:id', requireAuth, uploadFields, async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const parsed = workUpdateSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: 'Données invalides' })
    }

    const imageFile = req.files?.image?.[0]
    const image = imageFile ? await uploadImage(imageFile) : {}

    const modelFile = req.files?.model?.[0]
    const model = modelFile ? await uploadModel(modelFile) : {}

    const work = await prisma.work.update({
      where: { id },
      data: { ...parsed.data, ...image, ...model },
    })

    res.json(work)
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Œuvre introuvable' })
    }
    next(err)
  }
})

// Protégé : suppression. L'asset Cloudinary n'est volontairement pas détruit — il reste
// disponible pour recréer la pièce à l'identique si l'utilisateur clique "Annuler".
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    await prisma.work.delete({ where: { id } })
    res.status(204).end()
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Œuvre introuvable' })
    }
    next(err)
  }
})

// Protégé : réordonnancement — `ids` reflète le nouvel ordre voulu, du premier au dernier.
router.post('/reorder', requireAuth, async (req, res, next) => {
  try {
    const parsed = reorderSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: 'Données invalides' })
    }

    await prisma.$transaction(
      parsed.data.ids.map((id, index) =>
        prisma.work.update({ where: { id }, data: { order: index } })
      )
    )

    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

module.exports = router
