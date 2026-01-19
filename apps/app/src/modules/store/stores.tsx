/**
 * Central store registration.
 *
 * Import this file early in the app to register all store initializers.
 * This must be imported BEFORE calling useStoreInit().
 *
 * Usage in Router or App:
 *   import '../store/stores'; // Register all initializers
 *   import { useStoreInit } from '../store/useStoreInit';
 *
 * To add a new store with initialization:
 *   1. Create your store with an `initialize` function
 *   2. Import and register it here:
 *      import { initialize as initializeMyStore } from '../mymodule/store';
 *      registerInitializer(initializeMyStore);
 */

import { registerInitializer as _registerInitializer } from '@/modules/store/registry';

// Example: Register store initializers here
// The counter store in home/store.tsx doesn't need initialization,
// but if you had a store that needs async init (e.g., loading from API):
//
// import { initialize as initializeAuth } from '../auth/store';
// registerInitializer(initializeAuth);

// Currently no stores need async initialization in this template.
// The counter store uses persistence which is handled automatically.
