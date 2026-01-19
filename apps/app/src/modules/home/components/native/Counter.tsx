/**
 * Counter component for React Native platform.
 * Demonstrates Zustand store with cross-platform persistence.
 */

import { View, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Heading } from '@/design/components/Heading/native/Heading';
import { Text } from '@/design/components/Text/native/Text';
import { colors, spacing } from '@/design/theme';
import { useCounterStore, increment, decrement, reset, selectCount } from '@/modules/home/store';

export function Counter(): JSX.Element {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  const count = useCounterStore(selectCount);

  return (
    <View style={[styles.section, { backgroundColor: theme.bgSecondary }]}>
      <Heading level={2} variant="header-md/semibold">
        Counter Example
      </Heading>
      <Text variant="text-md/normal" color="text-secondary">
        Demonstrates Zustand store with cross-platform persistence.
      </Text>

      <View style={styles.counter}>
        <TouchableOpacity
          style={[styles.counterButton, { backgroundColor: theme.accent }]}
          onPress={decrement}
          activeOpacity={0.7}
        >
          <Text variant="header-lg/bold" color="none" style={styles.counterButtonText}>
            −
          </Text>
        </TouchableOpacity>

        <Text variant="header-xl/bold" style={styles.counterValue}>
          {count}
        </Text>

        <TouchableOpacity
          style={[styles.counterButton, { backgroundColor: theme.accent }]}
          onPress={increment}
          activeOpacity={0.7}
        >
          <Text variant="header-lg/bold" color="none" style={styles.counterButtonText}>
            +
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.resetButton, { borderColor: theme.border }]}
        onPress={reset}
        activeOpacity={0.7}
      >
        <Text variant="text-sm/medium">Reset</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    borderRadius: 12,
    padding: spacing.lg,
    gap: spacing.md,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.md,
  },
  counterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButtonText: {
    color: '#ffffff',
  },
  counterValue: {
    minWidth: 80,
    textAlign: 'center',
  },
  resetButton: {
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderRadius: 8,
  },
});
