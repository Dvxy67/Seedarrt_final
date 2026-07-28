const express = require('express')
const bcrypt = require('bcrypt')
const rateLimit = require('express-rate-limit')
const prisma = require('../lib/prisma')
const { signToken } = require('../lib/jwt')
const { credentialsSchema } = require('../schemas/auth')

const router = express.Router()

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de tentatives, réessayez plus tard' },
})

// Bootstrap : ne fonctionne que tant qu'aucun admin n'existe (un seul compte, celui de l'artiste).
router.post('/register', async (req, res, next) => {
  try {
    const existing = await prisma.admin.count()
    if (existing > 0) {
      return res.status(403).json({ error: 'Inscription fermée' })
    }

    const parsed = credentialsSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: 'Email ou mot de passe invalide' })
    }

    const { email, password } = parsed.data
    const passwordHash = await bcrypt.hash(password, 12)
    const admin = await prisma.admin.create({ data: { email, passwordHash } })

    const token = signToken(admin)
    res.status(201).json({ token })
  } catch (err) {
    next(err)
  }
})

router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const parsed = credentialsSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(401).json({ error: 'Identifiants invalides' })
    }

    const { email, password } = parsed.data
    const admin = await prisma.admin.findUnique({ where: { email } })
    if (!admin) {
      return res.status(401).json({ error: 'Identifiants invalides' })
    }

    const match = await bcrypt.compare(password, admin.passwordHash)
    if (!match) {
      return res.status(401).json({ error: 'Identifiants invalides' })
    }

    const token = signToken(admin)
    res.json({ token })
  } catch (err) {
    next(err)
  }
})

module.exports = router
