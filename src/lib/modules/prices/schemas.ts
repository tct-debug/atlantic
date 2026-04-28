import { z } from 'zod'

export const priceSchema = z.number({
  error: 'Valeur invalide',
}).positive({
  error: 'Le prix doit être supérieur à 0',
})

export type PriceValue = z.infer<typeof priceSchema>
