/**
 * Counter component for web platform.
 * Demonstrates Zustand store with cross-platform persistence.
 */

import { Heading } from '@/design/components/Heading/web/Heading';
import { Text } from '@/design/components/Text/web/Text';
import { useCounterStore, increment, decrement, reset, selectCount } from '@/modules/home/store';
import styles from './Counter.module.css';

export function Counter(): JSX.Element {
  const count = useCounterStore(selectCount);

  return (
    <section className={styles.section}>
      <Heading level={2} variant="header-md/semibold">
        Counter Example
      </Heading>
      <Text variant="text-md/normal" color="text-secondary" tag="p">
        Demonstrates Zustand store with cross-platform persistence.
      </Text>

      <div className={styles.counter}>
        <button
          type="button"
          className={styles.counterButton}
          onClick={decrement}
          aria-label="Decrement"
        >
          −
        </button>
        <Text variant="header-xl/bold" className={styles.counterValue}>
          {count}
        </Text>
        <button
          type="button"
          className={styles.counterButton}
          onClick={increment}
          aria-label="Increment"
        >
          +
        </button>
      </div>

      <button type="button" className={styles.resetButton} onClick={reset}>
        <Text variant="text-sm/medium">Reset</Text>
      </button>
    </section>
  );
}
