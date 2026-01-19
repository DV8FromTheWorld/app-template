/**
 * ItemList component for React Native platform.
 * Displays a list of items with delete functionality.
 */

import { useState } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Heading } from '@/design/components/Heading/native/Heading';
import { Text } from '@/design/components/Text/native/Text';
import { colors, spacing } from '@/design/theme';
import type { Item } from '@/modules/home/types';
import { createItem, deleteItem } from '@/modules/home/services/itemsApi';

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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  const [newItemName, setNewItemName] = useState('');

  async function handleCreateItem(): Promise<void> {
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
    <View style={[styles.section, { backgroundColor: theme.bgSecondary }]}>
      <Heading level={2} variant="header-md/semibold">
        Items API Example
      </Heading>
      <Text variant="text-md/normal" color="text-secondary">
        Demonstrates API integration with Fastify + Zod backend.
      </Text>

      {error !== null ? (
        <View style={[styles.error, { backgroundColor: theme.errorBg }]}>
          <Text variant="text-sm/medium" color="error">
            {error}
          </Text>
        </View>
      ) : null}

      <View style={styles.addForm}>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: theme.border,
              backgroundColor: theme.bgPrimary,
              color: theme.textPrimary,
            },
          ]}
          value={newItemName}
          onChangeText={setNewItemName}
          placeholder="Add new item..."
          placeholderTextColor={theme.textMuted}
          onSubmitEditing={handleCreateItem}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.accent }]}
          onPress={handleCreateItem}
          activeOpacity={0.7}
        >
          <Text variant="text-sm/semibold" color="none" style={styles.addButtonText}>
            Add
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <Text variant="text-md/normal" color="text-muted">
          Loading items...
        </Text>
      ) : items.length === 0 ? (
        <Text variant="text-md/normal" color="text-muted">
          No items yet. Add one above!
        </Text>
      ) : (
        <View style={styles.itemList}>
          {items.map((item) => (
            <View
              key={item.id}
              style={[
                styles.item,
                { backgroundColor: theme.bgPrimary, borderColor: theme.border },
              ]}
            >
              <View style={styles.itemContent}>
                <Text variant="text-md/medium">{item.name}</Text>
                {item.description !== undefined ? (
                  <Text variant="text-sm/normal" color="text-secondary">
                    {item.description}
                  </Text>
                ) : null}
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteItem(item.id)}
                activeOpacity={0.7}
              >
                <Text variant="text-lg/normal" color="text-muted">
                  ×
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    borderRadius: 12,
    padding: spacing.lg,
    gap: spacing.md,
  },
  error: {
    padding: spacing.sm,
    borderRadius: 8,
  },
  addForm: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 14,
  },
  addButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#ffffff',
  },
  itemList: {
    gap: spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
  },
  itemContent: {
    flex: 1,
    gap: spacing.xs,
  },
  deleteButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
