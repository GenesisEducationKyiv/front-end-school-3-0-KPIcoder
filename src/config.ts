export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  adapter: 'rpc' as 'rest' | 'rpc',
} as const;
