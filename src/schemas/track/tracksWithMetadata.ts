import { z as zsu } from 'zod';
import { trackSchema } from './track';

const metaSchema = zsu.object({
  total: zsu.number(),
  limit: zsu.number(),
});

export const tracksWithMetadataSchema = zsu.object({
  data: zsu.array(trackSchema),
  meta: metaSchema,
});
