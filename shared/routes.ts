import { z } from 'zod';
import { animes, episodes } from './schema';

export const errorSchemas = {
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  animes: {
    list: {
      method: 'GET' as const,
      path: '/api/animes',
      responses: {
        200: z.array(z.custom<typeof animes.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/animes/:id',
      responses: {
        200: z.custom<typeof animes.$inferSelect & { episodes: typeof episodes.$inferSelect[] }>(),
        404: errorSchemas.notFound,
      },
    },
  },
  episodes: {
    get: {
      method: 'GET' as const,
      path: '/api/episodes/:id',
      responses: {
        200: z.custom<typeof episodes.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    }
  },
  admin: {
    addAnime: {
      method: 'POST' as const,
      path: '/api/admin/anime',
      body: z.object({ malId: z.number(), password: z.string() }),
      responses: {
        201: z.custom<typeof animes.$inferSelect>(),
        401: z.object({ message: z.string() }),
      }
    },
    deleteAnime: {
      method: 'DELETE' as const,
      path: '/api/admin/anime/:id',
      body: z.object({ password: z.string() }),
      responses: {
        200: z.object({ success: z.boolean() }),
        401: z.object({ message: z.string() }),
        404: errorSchemas.notFound,
      }
    },
    addManualAnime: {
      method: 'POST' as const,
      path: '/api/admin/anime/manual',
      body: z.object({ 
        title: z.string(), 
        description: z.string(), 
        coverUrl: z.string(), 
        rating: z.string(),
        videoUrl: z.string(),
        password: z.string() 
      }),
      responses: {
        201: z.custom<typeof animes.$inferSelect>(),
        401: z.object({ message: z.string() }),
      }
    }
  }
};

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
