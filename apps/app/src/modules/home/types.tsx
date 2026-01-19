/**
 * Home module types.
 * Shared between web and native platforms.
 */

/**
 * Item from the API.
 */
export interface Item {
  id: string;
  name: string;
  description?: string | undefined;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * API response for listing items.
 */
export interface ItemListResponse {
  items: Item[];
  total: number;
}

/**
 * Create item request payload.
 */
export interface CreateItemRequest {
  name: string;
  description?: string | undefined;
}

/**
 * Update item request payload.
 */
export interface UpdateItemRequest {
  name?: string | undefined;
  description?: string | undefined;
  completed?: boolean | undefined;
}
