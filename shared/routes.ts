import { z } from 'zod';
import { insertClickSchema, clicks } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  clicks: {
    listToday: {
      method: 'GET' as const,
      path: '/api/clicks/today',
      responses: {
        200: z.array(z.custom<typeof clicks.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/clicks',
      input: insertClickSchema,
      responses: {
        201: z.custom<typeof clicks.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

// ============================================
// REQUIRED: buildUrl helper
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// ============================================
// TYPE HELPERS
// ============================================
export type CreateClickInput = z.infer<typeof api.clicks.create.input>;
export type ClickResponse = z.infer<typeof api.clicks.create.responses[201]>;
export type ClicksListResponse = z.infer<typeof api.clicks.listToday.responses[200]>;
