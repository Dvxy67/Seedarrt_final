const { z } = require('zod')

const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  company: z.string().optional(), // honeypot : la route répond succès sans écrire si rempli
})

const unsubscribeSchema = z.object({
  ids: z.array(z.coerce.number().int()).min(1),
})

module.exports = { newsletterSchema, unsubscribeSchema }
