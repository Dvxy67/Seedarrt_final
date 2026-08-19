const express = require('express')
const multer = require('multer')
const prisma = require('../lib/prisma')
const cloudinary = require('../lib/cloudinary')
const requireAuth = require('../middleware/requireAuth')
const { workSchema } = require('../schemas/work')

const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
})

// Public : liste des œuvres, triée par `order`, avec filtre optionnel par catégorie.
router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query
    const works = await prisma.work.findMany({
      where: category ? { category } : undefined,
      orderBy: { order: 'asc' },
    })
    res.json(works)
  } catch (err) {
    next(err)
  }
})

// Protégé : création d'une œuvre + upload de son image sur Cloudinary.
router.post('/', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    const parsed = workSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: 'Données invalides' })
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Image requise' })
    }

    const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
    const uploaded = await cloudinary.uploader.upload(dataUri, { folder: 'seedarrt' })

    const order = await prisma.work.count()
    const work = await prisma.work.create({
      data: {
        ...parsed.data,
        imageUrl: uploaded.secure_url,
        imagePublicId: uploaded.public_id,
        order,
      },
    })

    res.status(201).json(work)
  } catch (err) {
    next(err)
  }
})

module.exports = router
