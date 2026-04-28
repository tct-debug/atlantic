import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, 'Votre nom est requis.'),
  email: z.string().email('Adresse email invalide.'),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10, 'Votre message doit contenir au moins 10 caractères.'),
})

export type ContactSchemaInput = z.infer<typeof contactSchema>
