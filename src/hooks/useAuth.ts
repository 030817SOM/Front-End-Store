import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  authApi,
  isAuthenticated,
  type LoginRequest,
  type RegisterRequest,
  type UpdateProfileRequest,
  type ChangePasswordRequest,
} from '@/lib/api/auth';
import { toast } from 'sonner';
import { cartKeys } from './useCart';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

// Hook to get current user
export const useUser = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: () => authApi.getMe(),
    staleTime: 5 * 60 * 1000,
    enabled: isAuthenticated(),
  });
};

// Hook to login
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      toast.success('Welcome back!');
      queryClient.setQueryData(authKeys.user(), { data: response.data.user });
      // Sync cart after login
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Invalid credentials');
    },
  });
};

// Hook to register
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (response) => {
      toast.success('Account created successfully!');
      queryClient.setQueryData(authKeys.user(), { data: response.data.user });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create account');
    },
  });
};

// Hook to logout
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      toast.success('Logged out successfully');
      queryClient.clear();
      window.location.href = '/';
    },
    onError: () => {
      // Still clear local state even if API fails
      localStorage.removeItem('nexus_token');
      localStorage.removeItem('nexus_refresh_token');
      queryClient.clear();
      window.location.href = '/';
    },
  });
};

// Hook to forgot password
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword({ email }),
    onSuccess: () => {
      toast.success('Password reset link sent to your email');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send reset link');
    },
  });
};

// Hook to reset password
export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: {
      email: string;
      token: string;
      password: string;
      password_confirmation: string;
    }) => authApi.resetPassword(data),
    onSuccess: () => {
      toast.success('Password reset successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reset password');
    },
  });
};

// Hook to update profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => authApi.updateProfile(data),
    onSuccess: (response) => {
      toast.success('Profile updated successfully!');
      queryClient.setQueryData(authKeys.user(), { data: response.data });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
};

// Hook to change password
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => authApi.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to change password');
    },
  });
};

// Hook to delete account
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (password: string) => authApi.deleteAccount(password),
    onSuccess: () => {
      toast.success('Account deleted successfully');
      queryClient.clear();
      window.location.href = '/';
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete account');
    },
  });
};

// Hook to verify email
export const useVerifyEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
    onSuccess: () => {
      toast.success('Email verified successfully!');
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to verify email');
    },
  });
};

// Hook to resend verification email
export const useResendVerification = () => {
  return useMutation({
    mutationFn: () => authApi.resendVerification(),
    onSuccess: () => {
      toast.success('Verification email sent!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send verification email');
    },
  });
};
