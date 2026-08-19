const express = require('express')
const prisma = require('../lib/prisma')

const router = express.Router()

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

module.exports = router
