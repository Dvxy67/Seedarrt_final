const { z } = require('zod')

const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
})

module.exports = { credentialsSchema }
