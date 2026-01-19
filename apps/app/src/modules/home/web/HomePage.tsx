/**
 * Home page for web platform.
 *
 * Demonstrates:
 * - Design system component usage (Heading, Text)
 * - Store pattern usage
 * - API integration
 * - Component composition
 */

import { Heading } from '@/design/components/Heading/web/Heading';
import { Text } from '@/design/components/Text/web/Text';
import { Counter } from '@/modules/home/components/web/Counter';
import { ItemList } from '@/modules/home/components/web/ItemList';
import { useItems } from '@/modules/home/hooks/useItems';

import styles from './HomePage.module.css';

export function HomePage(): React.JSX.Element {
  const { items, isLoading, error, setItems, setError } = useItems();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Heading level={1}>App Template</Heading>
        <Text variant="text-lg/normal" color="text-secondary">
          A cross-platform web + React Native monorepo template
        </Text>
      </header>

      <Counter />

      <ItemList
        items={items}
        isLoading={isLoading}
        error={error}
        onItemsChange={setItems}
        onError={setError}
      />

      <footer className={styles.footer}>
        <Text variant="text-sm/normal" color="text-muted">
          Edit <Text variant="code">apps/app/src/modules/home/</Text> to get started.
        </Text>
      </footer>
    </div>
  );
}
