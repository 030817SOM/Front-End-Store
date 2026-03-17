import axios, { type AxiosInstance, type AxiosError } from 'axios';
import { toast } from 'sonner';
import { API_CONFIG } from './config';

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('nexus_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const message = error.response?.data?.message || 'Something went wrong';
    
    // Handle specific error codes
    switch (error.response?.status) {
      case 401:
        localStorage.removeItem('nexus_token');
        localStorage.removeItem('nexus_refresh_token');
        toast.error('Session expired. Please login again.');
        break;
      case 403:
        toast.error('You do not have permission to perform this action.');
        break;
      case 404:
        toast.error('Resource not found.');
        break;
      case 422:
        toast.error(message);
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// Types
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('nexus_token');
};

// Get auth token
export const getToken = (): string | null => {
  return localStorage.getItem('nexus_token');
};
