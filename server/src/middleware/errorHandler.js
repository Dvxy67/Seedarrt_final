function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Route introuvable' })
}

// Filet de sécurité pour les erreurs non gérées explicitement par une route
// (ex: erreurs Prisma). Le message détaillé part dans les logs serveur, jamais
// dans la réponse, pour ne pas fuiter de détails internes au client.
function errorHandler(err, req, res, next) {
  console.error(err)
  const status = err.status || 500
  res.status(status).json({ error: status === 500 ? 'Erreur serveur' : err.message })
}

module.exports = { notFoundHandler, errorHandler }
