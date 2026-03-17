import { apiClient } from './client';
import { mockAuthApi } from './mock';
import { shouldUseMockApi } from './config';
import type { ApiResponse } from './client';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  phone?: string;
  date_of_birth?: string;
  email_verified_at?: string;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refresh_token: string;
  expires_in: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: string;
  avatar?: File;
}

export interface ChangePasswordRequest {
  current_password: string;
  password: string;
  password_confirmation: string;
}

// Auth API endpoints - switches between mock and real API
export const authApi = {
  // Login
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    if (shouldUseMockApi()) {
      const response = await mockAuthApi.login(data);
      if (response.data.token) {
        localStorage.setItem('nexus_token', response.data.token);
        localStorage.setItem('nexus_refresh_token', response.data.refresh_token);
      }
      return response;
    }

    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      data
    );
    if (response.data.data.token) {
      localStorage.setItem('nexus_token', response.data.data.token);
      localStorage.setItem('nexus_refresh_token', response.data.data.refresh_token);
    }
    return response.data;
  },

  // Register
  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    if (shouldUseMockApi()) {
      const response = await mockAuthApi.register(data);
      if (response.data.token) {
        localStorage.setItem('nexus_token', response.data.token);
        localStorage.setItem('nexus_refresh_token', response.data.refresh_token);
      }
      return response;
    }

    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      data
    );
    if (response.data.data.token) {
      localStorage.setItem('nexus_token', response.data.data.token);
      localStorage.setItem('nexus_refresh_token', response.data.data.refresh_token);
    }
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    if (shouldUseMockApi()) {
      await mockAuthApi.logout();
      localStorage.removeItem('nexus_token');
      localStorage.removeItem('nexus_refresh_token');
      return;
    }

    await apiClient.post('/auth/logout');
    localStorage.removeItem('nexus_token');
    localStorage.removeItem('nexus_refresh_token');
  },

  // Get current user
  getMe: async (): Promise<ApiResponse<User>> => {
    if (shouldUseMockApi()) {
      return mockAuthApi.getMe();
    }

    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },

  // Refresh token
  refreshToken: async (): Promise<ApiResponse<{ token: string; expires_in: number }>> => {
    const refreshToken = localStorage.getItem('nexus_refresh_token');
    const response = await apiClient.post<ApiResponse<{ token: string; expires_in: number }>>(
      '/auth/refresh',
      { refresh_token: refreshToken }
    );
    if (response.data.data.token) {
      localStorage.setItem('nexus_token', response.data.data.token);
    }
    return response.data;
  },

  // Request password reset
  forgotPassword: async (data: PasswordResetRequest): Promise<ApiResponse<void>> => {
    if (shouldUseMockApi()) {
      return mockAuthApi.forgotPassword(data);
    }

    const response = await apiClient.post<ApiResponse<void>>(
      '/auth/forgot-password',
      data
    );
    return response.data;
  },

  // Reset password
  resetPassword: async (data: PasswordResetConfirm): Promise<ApiResponse<void>> => {
    if (shouldUseMockApi()) {
      return mockAuthApi.resetPassword(data);
    }

    const response = await apiClient.post<ApiResponse<void>>(
      '/auth/reset-password',
      data
    );
    return response.data;
  },

  // Verify email
  verifyEmail: async (token: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>('/auth/verify-email', {
      token,
    });
    return response.data;
  },

  // Resend verification email
  resendVerification: async (): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(
      '/auth/resend-verification'
    );
    return response.data;
  },

  // Update profile
  updateProfile: async (data: UpdateProfileRequest): Promise<ApiResponse<User>> => {
    if (shouldUseMockApi()) {
      return mockAuthApi.updateProfile(data);
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value instanceof File ? value : String(value));
      }
    });

    const response = await apiClient.post<ApiResponse<User>>('/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Change password
  changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse<void>> => {
    if (shouldUseMockApi()) {
      return mockAuthApi.changePassword(data);
    }

    const response = await apiClient.post<ApiResponse<void>>(
      '/auth/change-password',
      data
    );
    return response.data;
  },

  // Delete account
  deleteAccount: async (password: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>('/auth/delete-account', {
      password,
    });
    localStorage.removeItem('nexus_token');
    localStorage.removeItem('nexus_refresh_token');
    return response.data;
  },
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('nexus_token');
};

// Get auth token
export const getToken = (): string | null => {
  return localStorage.getItem('nexus_token');
};
