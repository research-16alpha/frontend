// Frontend Routes Configuration
export const routes = {
  home: '/',
  products: '/products',
  account: '/account',
  about: '/about',
  authCallback: '/auth/callback',
} as const;

export type Route = typeof routes[keyof typeof routes];

