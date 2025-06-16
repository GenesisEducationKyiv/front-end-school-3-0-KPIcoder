import { z } from 'zod'

export const searchParamsSchema = z.object({
  search: z.string().optional(),
  genre: z.string().optional(),
  artist: z.string().optional(),
  sort: z.enum(['title', 'artist', 'album', 'createdAt']).default('title'),
  order: z.enum(['asc', 'desc']).default('asc'),
  page: z.number().default(1),
  limit: z.number().default(10)
})

export type TracksFilterOptions = z.infer<typeof searchParamsSchema>;