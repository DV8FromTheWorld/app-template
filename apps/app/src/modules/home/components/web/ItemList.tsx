/**
 * ItemList component for web platform.
 * Displays a list of items with delete functionality.
 */

import { useState } from 'react';

import { Heading } from '@/design/components/Heading/web/Heading';
import { Text } from '@/design/components/Text/web/Text';
import { createItem, deleteItem } from '@/modules/home/services/itemsApi';
import type { Item } from '@/modules/home/types';

import styles from './ItemList.module.css';

interface ItemListProps {
  items: Item[];
  isLoading: boolean;
  error: string | null;
  onItemsChange: (items: Item[]) => void;
  onError: (error: string | null) => void;
}

export function ItemList({
  items,
  isLoading,
  error,
  onItemsChange,
  onError,
}: ItemListProps): JSX.Element {
  const [newItemName, setNewItemName] = useState('');

  async function handleCreateItem(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (newItemName.trim() === '') return;

    try {
      const item = await createItem({ name: newItemName.trim() });
      onItemsChange([...items, item]);
      setNewItemName('');
      onError(null);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to create item');
    }
  }

  async function handleDeleteItem(id: string): Promise<void> {
    try {
      await deleteItem(id);
      onItemsChange(items.filter((item) => item.id !== id));
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to delete item');
    }
  }

  return (
    <section className={styles.section}>
      <Heading level={2} variant="header-md/semibold">
        Items API Example
      </Heading>
      <Text variant="text-md/normal" color="text-secondary" tag="p">
        Demonstrates API integration with Fastify + Zod backend.
      </Text>

      {error !== null ? (
        <div className={styles.error}>
          <Text variant="text-sm/medium" color="error">
            {error}
          </Text>
        </div>
      ) : null}

      <form onSubmit={handleCreateItem} className={styles.addForm}>
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Add new item..."
          className={styles.input}
        />
        <button type="submit" className={styles.addButton}>
          <Text variant="text-sm/semibold">Add</Text>
        </button>
      </form>

      {isLoading ? (
        <Text variant="text-md/normal" color="text-muted">
          Loading items...
        </Text>
      ) : items.length === 0 ? (
        <Text variant="text-md/normal" color="text-muted">
          No items yet. Add one above!
        </Text>
      ) : (
        <ul className={styles.itemList}>
          {items.map((item) => (
            <li key={item.id} className={styles.item}>
              <div className={styles.itemContent}>
                <Text variant="text-md/medium">{item.name}</Text>
                {item.description !== undefined ? (
                  <Text variant="text-sm/normal" color="text-secondary">
                    {item.description}
                  </Text>
                ) : null}
              </div>
              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => handleDeleteItem(item.id)}
                aria-label={`Delete ${item.name}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
