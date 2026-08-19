const { z } = require('zod')

const workSchema = z.object({
  title: z.string().trim().min(1),
  category: z.enum(['Peinture', '3D', 'Graphisme']),
  year: z.string().trim().min(4).max(4),
})

module.exports = { workSchema }
