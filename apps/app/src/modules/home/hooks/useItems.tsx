/**
 * Hook for managing items state.
 * Shared between web and native platforms.
 */

import { useCallback,useEffect, useState } from 'react';

import { fetchItems } from '@/modules/home/services/itemsApi';
import type { Item } from '@/modules/home/types';

interface UseItemsResult {
  items: Item[];
  isLoading: boolean;
  error: string | null;
  setItems: (items: Item[]) => void;
  setError: (error: string | null) => void;
  reload: () => Promise<void>;
}

export function useItems(): UseItemsResult {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadItems = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchItems();
      setItems(response.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load items');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  return {
    items,
    isLoading,
    error,
    setItems,
    setError,
    reload: loadItems,
  };
}
