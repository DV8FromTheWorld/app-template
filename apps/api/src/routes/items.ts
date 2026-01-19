/**
 * Items Routes - Example CRUD API
 *
 * Demonstrates Fastify + Zod patterns:
 * - Zod schema validation for request/response
 * - Proper HTTP status codes
 * - Type-safe route handlers
 *
 * Endpoints:
 * - GET    /items       - List all items
 * - GET    /items/:id   - Get item by ID
 * - POST   /items       - Create new item
 * - PUT    /items/:id   - Update item
 * - DELETE /items/:id   - Delete item
 */

import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

// ============================================================================
// Schemas
// ============================================================================

const ItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  completed: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

type Item = z.infer<typeof ItemSchema>;

const CreateItemSchema = z.object({
  name: z.string().min(1).describe('Item name'),
  description: z.string().optional().describe('Optional description'),
});

const UpdateItemSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

const ItemListSchema = z.object({
  items: z.array(ItemSchema),
  total: z.number(),
});

const ErrorSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
});

// ============================================================================
// In-Memory Store (replace with database in real app)
// ============================================================================

const items: Map<string, Item> = new Map();

// Seed with example data
const now = new Date().toISOString();
items.set('1', {
  id: '1',
  name: 'Learn TypeScript',
  description: 'Study the TypeScript handbook',
  completed: true,
  createdAt: now,
  updatedAt: now,
});
items.set('2', {
  id: '2',
  name: 'Build an app',
  description: 'Create a web and mobile app with this template',
  completed: false,
  createdAt: now,
  updatedAt: now,
});

let nextId = 3;

// ============================================================================
// Routes
// ============================================================================

export const itemRoutes: FastifyPluginAsync = async (fastify) => {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  /**
   * GET /items
   * List all items
   */
  app.get(
    '/',
    {
      schema: {
        response: {
          200: ItemListSchema,
        },
      },
    },
    async () => {
      const allItems = Array.from(items.values());
      return {
        items: allItems,
        total: allItems.length,
      };
    }
  );

  /**
   * GET /items/:id
   * Get a single item by ID
   */
  app.get(
    '/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: ItemSchema,
          404: ErrorSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const item = items.get(id);

      if (!item) {
        return reply.status(404).send({
          error: 'not_found',
          message: `Item with id "${id}" not found`,
        });
      }

      return item;
    }
  );

  /**
   * POST /items
   * Create a new item
   */
  app.post(
    '/',
    {
      schema: {
        body: CreateItemSchema,
        response: {
          201: ItemSchema,
        },
      },
    },
    async (request, reply) => {
      const { name, description } = request.body;
      const now = new Date().toISOString();

      const item: Item = {
        id: String(nextId++),
        name,
        description,
        completed: false,
        createdAt: now,
        updatedAt: now,
      };

      items.set(item.id, item);

      return reply.status(201).send(item);
    }
  );

  /**
   * PUT /items/:id
   * Update an existing item
   */
  app.put(
    '/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        body: UpdateItemSchema,
        response: {
          200: ItemSchema,
          404: ErrorSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const existing = items.get(id);

      if (!existing) {
        return reply.status(404).send({
          error: 'not_found',
          message: `Item with id "${id}" not found`,
        });
      }

      const { name, description, completed } = request.body;
      const updated: Item = {
        ...existing,
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(completed !== undefined && { completed }),
        updatedAt: new Date().toISOString(),
      };

      items.set(id, updated);

      return updated;
    }
  );

  /**
   * DELETE /items/:id
   * Delete an item
   */
  app.delete(
    '/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        response: {
          204: z.null(),
          404: ErrorSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      if (!items.has(id)) {
        return reply.status(404).send({
          error: 'not_found',
          message: `Item with id "${id}" not found`,
        });
      }

      items.delete(id);

      return reply.status(204).send();
    }
  );
};
