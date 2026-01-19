/**
 * Shared route definitions used by both web and native routers.
 */

export const routes = {
  home: '/',
} as const;

export type RouteName = keyof typeof routes;
