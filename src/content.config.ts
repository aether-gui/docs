import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// Two project fields on top of the Starlight schema:
// - status marks pages that describe planned or gated functionality so the
//   sidebar badge and page banner stay in sync with what the product ships.
// - products records which repos a page documents; used for edit links and
//   for auditing coverage.
export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        status: z.enum(['stable', 'beta', 'planned']).optional(),
        products: z
          .array(z.enum(['aether-ops', 'aether-ops-web', 'aether-ops-bootstrap', 'aether-ops-iso']))
          .optional(),
      }),
    }),
  }),
};
