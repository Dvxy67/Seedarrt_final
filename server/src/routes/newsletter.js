const express = require('express')
const prisma = require('../lib/prisma')
const { newsletterSchema } = require('../schemas/newsletter')

const router = express.Router()

router.post('/', async (req, res, next) => {
  const parsed = newsletterSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Adresse email invalide' })
  }

  // Honeypot rempli → bot. On répond succès sans rien écrire, pour ne pas l'informer.
  if (parsed.data.company) {
    return res.json({ ok: true })
  }

  try {
    await prisma.subscriber.upsert({
      where: { email: parsed.data.email },
      update: {},
      create: { email: parsed.data.email },
    })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

module.exports = router
