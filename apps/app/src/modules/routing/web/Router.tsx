/**
 * Web router implementation using react-router-dom.
 */

import '@/modules/store/stores'; // Register all store initializers

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { HomePage } from '@/modules/home/web/HomePage';
import { useStoreInit } from '@/modules/store/useStoreInit';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
]);

export function Router(): JSX.Element {
  // Initialize all registered stores on app start
  useStoreInit();

  return <RouterProvider router={router} />;
}
