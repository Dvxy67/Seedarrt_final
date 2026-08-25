const { z } = require('zod')

const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  company: z.string().optional(), // honeypot : la route répond succès sans écrire si rempli
})

module.exports = { newsletterSchema }
