const jwt = require('jsonwebtoken')

function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentification requise' })
  }

  const token = header.slice('Bearer '.length)

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.admin = { id: payload.sub, email: payload.email }
    next()
  } catch {
    res.status(401).json({ error: 'Token invalide ou expiré' })
  }
}

module.exports = requireAuth
