// Export all API services
export { apiClient, isAuthenticated, getToken } from './client';
export type { ApiResponse, PaginatedResponse, ApiErrorResponse } from './client';

export { productsApi } from './products';
export type { ProductFilters, Category, Review } from './products';

export { cartApi } from './cart';
export type { Cart, AddToCartRequest, UpdateCartItemRequest } from './cart';

export { ordersApi } from './orders';
export type {
  Order,
  OrderItem,
  ShippingAddress,
  BillingAddress,
  PaymentMethod,
  CreateOrderRequest,
  PaymentIntent,
} from './orders';

export { authApi } from './auth';
export type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UpdateProfileRequest,
} from './auth';

export { API_CONFIG, shouldUseMockApi } from './config';

// Export mock API for testing/debugging
export { mockProductsApi, mockCartApi, mockOrdersApi, mockAuthApi } from './mock';
