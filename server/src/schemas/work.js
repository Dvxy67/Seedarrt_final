const { z } = require('zod')

// Le multipart n'envoie que des strings — un booléen coché arrive en 'true'/'false'.
const boolFromString = z.union([z.literal('true'), z.literal('false')]).transform(v => v === 'true')

const workSchema = z.object({
  title: z.string().trim().min(1),
  category: z.enum(['Peinture', '3D', 'Graphisme']),
  year: z.string().trim().min(4).max(4),
  description: z.string().trim().max(500).optional().default(''),
  published: boolFromString.optional().default(true),
})

// Édition partielle : tous les champs optionnels, mêmes règles que la création.
const workUpdateSchema = z.object({
  title: z.string().trim().min(1).optional(),
  category: z.enum(['Peinture', '3D', 'Graphisme']).optional(),
  year: z.string().trim().min(4).max(4).optional(),
  description: z.string().trim().max(500).optional(),
  published: boolFromString.optional(),
})

const reorderSchema = z.object({
  ids: z.array(z.coerce.number().int()).min(1),
})

module.exports = { workSchema, workUpdateSchema, reorderSchema }
