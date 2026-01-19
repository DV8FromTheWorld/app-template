/**
 * Home module store.
 *
 * Demonstrates the store pattern using createStore from the store module.
 * This is a simple counter example that can be persisted across sessions.
 *
 * Usage in React:
 *   const count = useCounterStore((s) => s.count);
 *   const { increment, decrement, reset } = useCounterStore.getState();
 *
 * Usage outside React:
 *   const count = useCounterStore.getState().count;
 *   increment();
 */

import { createPersistentStore } from '@/modules/store/createStore';

// ============================================================================
// State
// ============================================================================

interface CounterState {
  count: number;
  lastUpdated: string | null;
}

export const useCounterStore = createPersistentStore<CounterState>()(
  () => ({
    count: 0,
    lastUpdated: null,
  }),
  {
    name: 'app-template-counter',
    partialize: (state) => ({ count: state.count }),
  }
);

// ============================================================================
// Actions
// ============================================================================

/**
 * Increment the counter by 1.
 */
export function increment(): void {
  useCounterStore.setState((state) => ({
    count: state.count + 1,
    lastUpdated: new Date().toISOString(),
  }));
}

/**
 * Decrement the counter by 1.
 */
export function decrement(): void {
  useCounterStore.setState((state) => ({
    count: state.count - 1,
    lastUpdated: new Date().toISOString(),
  }));
}

/**
 * Reset the counter to 0.
 */
export function reset(): void {
  useCounterStore.setState({
    count: 0,
    lastUpdated: new Date().toISOString(),
  });
}

// ============================================================================
// Selectors
// ============================================================================

export const selectCount = (state: CounterState): number => state.count;
export const selectLastUpdated = (state: CounterState): string | null =>
  state.lastUpdated;
