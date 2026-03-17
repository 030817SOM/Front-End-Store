// API Configuration
export const API_CONFIG = {
  // Set to true to use mock API, false to use real API
  USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API === 'true' || 
                !import.meta.env.VITE_API_URL ||
                import.meta.env.VITE_API_URL.includes('demo'),
  
  // Base URL for real API
  BASE_URL: import.meta.env.VITE_API_URL || 'https://api.nexus-store.demo/v1',
  
  // Request timeout in milliseconds
  TIMEOUT: 10000,
  
  // Default stale time for queries (5 minutes)
  DEFAULT_STALE_TIME: 5 * 60 * 1000,
  
  // Default cache time for queries (10 minutes)
  DEFAULT_CACHE_TIME: 10 * 60 * 1000,
};

// Helper to check if we should use mock API
export const shouldUseMockApi = (): boolean => {
  return API_CONFIG.USE_MOCK_API;
};
