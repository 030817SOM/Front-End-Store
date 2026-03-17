import { apiClient } from './client';
import { mockCartApi } from './mock';
import { shouldUseMockApi } from './config';
import type { ApiResponse } from './client';
import type { CartItem } from '@/store/cartStore';

export interface Cart {
  id: string;
  user_id?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  item_count: number;
  coupon?: {
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
  };
}

export interface AddToCartRequest {
  product_id: string;
  quantity: number;
  variant_id?: string;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface ApplyCouponRequest {
  code: string;
}

// Cart API endpoints - switches between mock and real API
export const cartApi = {
  // Get user's cart
  getCart: async (): Promise<ApiResponse<Cart>> => {
    if (shouldUseMockApi()) {
      return mockCartApi.getCart();
    }

    const response = await apiClient.get<ApiResponse<Cart>>('/cart');
    return response.data;
  },

  // Add item to cart
  addItem: async (data: AddToCartRequest): Promise<ApiResponse<Cart>> => {
    if (shouldUseMockApi()) {
      return mockCartApi.addItem(data);
    }

    const response = await apiClient.post<ApiResponse<Cart>>('/cart/items', data);
    return response.data;
  },

  // Update cart item quantity
  updateItem: async (
    itemId: string,
    data: UpdateCartItemRequest
  ): Promise<ApiResponse<Cart>> => {
    if (shouldUseMockApi()) {
      return mockCartApi.updateItem(itemId, data);
    }

    const response = await apiClient.put<ApiResponse<Cart>>(
      `/cart/items/${itemId}`,
      data
    );
    return response.data;
  },

  // Remove item from cart
  removeItem: async (itemId: string): Promise<ApiResponse<Cart>> => {
    if (shouldUseMockApi()) {
      return mockCartApi.removeItem(itemId);
    }

    const response = await apiClient.delete<ApiResponse<Cart>>(
      `/cart/items/${itemId}`
    );
    return response.data;
  },

  // Clear cart
  clearCart: async (): Promise<ApiResponse<Cart>> => {
    if (shouldUseMockApi()) {
      return mockCartApi.clearCart();
    }

    const response = await apiClient.delete<ApiResponse<Cart>>('/cart');
    return response.data;
  },

  // Apply coupon code
  applyCoupon: async (code: string): Promise<ApiResponse<Cart>> => {
    if (shouldUseMockApi()) {
      return mockCartApi.applyCoupon(code);
    }

    const response = await apiClient.post<ApiResponse<Cart>>('/cart/coupon', {
      code,
    });
    return response.data;
  },

  // Remove coupon
  removeCoupon: async (): Promise<ApiResponse<Cart>> => {
    if (shouldUseMockApi()) {
      return mockCartApi.removeCoupon();
    }

    const response = await apiClient.delete<ApiResponse<Cart>>('/cart/coupon');
    return response.data;
  },

  // Sync local cart with server (for guest users)
  syncCart: async (items: { product_id: string; quantity: number }[]): Promise<ApiResponse<Cart>> => {
    if (shouldUseMockApi()) {
      return mockCartApi.syncCart(items);
    }

    const response = await apiClient.post<ApiResponse<Cart>>('/cart/sync', {
      items,
    });
    return response.data;
  },

  // Merge guest cart with user cart after login
  mergeCart: async (guestCartId: string): Promise<ApiResponse<Cart>> => {
    const response = await apiClient.post<ApiResponse<Cart>>('/cart/merge', {
      guest_cart_id: guestCartId,
    });
    return response.data;
  },

  // Get shipping estimates
  getShippingEstimates: async (
    country: string,
    postalCode: string
  ): Promise<
    ApiResponse<
      {
        id: string;
        name: string;
        description: string;
        price: number;
        estimated_days: string;
      }[]
    >
  > => {
    const response = await apiClient.post<
      ApiResponse<
        {
          id: string;
          name: string;
          description: string;
          price: number;
          estimated_days: string;
        }[]
      >
    >('/cart/shipping-estimates', {
      country,
      postal_code: postalCode,
    });
    return response.data;
  },
};
