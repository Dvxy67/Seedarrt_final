const express = require('express')
const { stringify } = require('csv-stringify/sync')
const prisma = require('../lib/prisma')
const requireAuth = require('../middleware/requireAuth')
const { newsletterSchema, unsubscribeSchema } = require('../schemas/newsletter')

const router = express.Router()

// Public : inscription (formulaire du site).
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

// Protégé : liste complète pour le dashboard.
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const subs = await prisma.subscriber.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(subs)
  } catch (err) {
    next(err)
  }
})

// Protégé : désinscription groupée depuis le dashboard.
router.post('/unsubscribe', requireAuth, async (req, res, next) => {
  try {
    const parsed = unsubscribeSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: 'Données invalides' })
    }

    await prisma.subscriber.updateMany({
      where: { id: { in: parsed.data.ids } },
      data: { active: false },
    })

    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

// Protégé : export CSV des abonnés actifs, pour import dans un outil d'emailing.
router.get('/export.csv', requireAuth, async (req, res, next) => {
  try {
    const subs = await prisma.subscriber.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    })

    const csv = stringify(
      subs.map(s => ({
        email: s.email,
        inscrit_le: s.createdAt.toISOString().slice(0, 10),
        origine: s.origin,
      })),
      { header: true }
    )

    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="abonnes-seedarrt.csv"')
    res.send(csv)
  } catch (err) {
    next(err)
  }
})

module.exports = router
