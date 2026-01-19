/**
 * Home screen for React Native platform.
 *
 * Demonstrates:
 * - Design system component usage (Heading, Text)
 * - Store pattern usage
 * - API integration
 * - Component composition
 */

import { View, ScrollView, StyleSheet, useColorScheme, SafeAreaView } from 'react-native';
import { Heading } from '@/design/components/Heading/native/Heading';
import { Text } from '@/design/components/Text/native/Text';
import { colors, spacing } from '@/design/theme';
import { Counter } from '@/modules/home/components/native/Counter';
import { ItemList } from '@/modules/home/components/native/ItemList';
import { useItems } from '@/modules/home/hooks/useItems';

export function HomeScreen(): JSX.Element {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  const { items, isLoading, error, setItems, setError } = useItems();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bgPrimary }]}>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.bgPrimary }]}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Heading level={1}>App Template</Heading>
          <Text variant="text-lg/normal" color="text-secondary">
            A cross-platform web + React Native monorepo template
          </Text>
        </View>

        <Counter />

        <ItemList
          items={items}
          isLoading={isLoading}
          error={error}
          onItemsChange={setItems}
          onError={setError}
        />

        {/* Footer */}
        <View style={styles.footer}>
          <Text variant="text-sm/normal" color="text-muted">
            Edit apps/app/src/modules/home/ to get started.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
});
