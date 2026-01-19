/**
 * Items API client.
 *
 * Demonstrates the API integration pattern with typed fetch calls.
 * Uses the env config for the API URL.
 */

import { env } from '@/config/env';
import type { CreateItemRequest, Item, ItemListResponse, UpdateItemRequest } from '@/modules/home/types';

/**
 * Custom error class for API errors.
 */
export class ItemsApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ItemsApiError';
  }
}

/**
 * Fetch all items.
 */
export async function fetchItems(): Promise<ItemListResponse> {
  const response = await fetch(`${env.apiUrl}/items`);

  if (!response.ok) {
    throw new ItemsApiError('Failed to fetch items', response.status);
  }

  return response.json() as Promise<ItemListResponse>;
}

/**
 * Fetch a single item by ID.
 */
export async function fetchItem(id: string): Promise<Item> {
  const response = await fetch(`${env.apiUrl}/items/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new ItemsApiError(`Item "${id}" not found`, 404);
    }
    throw new ItemsApiError('Failed to fetch item', response.status);
  }

  return response.json() as Promise<Item>;
}

/**
 * Create a new item.
 */
export async function createItem(data: CreateItemRequest): Promise<Item> {
  const response = await fetch(`${env.apiUrl}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new ItemsApiError('Failed to create item', response.status);
  }

  return response.json() as Promise<Item>;
}

/**
 * Update an existing item.
 */
export async function updateItem(id: string, data: UpdateItemRequest): Promise<Item> {
  const response = await fetch(`${env.apiUrl}/items/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new ItemsApiError(`Item "${id}" not found`, 404);
    }
    throw new ItemsApiError('Failed to update item', response.status);
  }

  return response.json() as Promise<Item>;
}

/**
 * Delete an item.
 */
export async function deleteItem(id: string): Promise<void> {
  const response = await fetch(`${env.apiUrl}/items/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new ItemsApiError(`Item "${id}" not found`, 404);
    }
    throw new ItemsApiError('Failed to delete item', response.status);
  }
}
