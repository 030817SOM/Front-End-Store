import { apiClient } from './client';
import { mockOrdersApi } from './mock';
import { shouldUseMockApi } from './config';
import type { ApiResponse, PaginatedResponse } from './client';
import type { CartItem } from '@/store/cartStore';

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
}

export interface BillingAddress extends ShippingAddress {
  same_as_shipping?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'crypto';
  last4?: string;
  brand?: string;
  exp_month?: number;
  exp_year?: number;
}

export interface OrderItem extends CartItem {
  order_id: string;
  price_at_time: number;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  shipping_address: ShippingAddress;
  billing_address: BillingAddress;
  shipping_method: {
    id: string;
    name: string;
    price: number;
  };
  coupon_code?: string;
  notes?: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderRequest {
  shipping_address: ShippingAddress;
  billing_address: BillingAddress;
  shipping_method_id: string;
  payment_method_id: string;
  coupon_code?: string;
  notes?: string;
}

export interface PaymentIntent {
  client_secret: string;
  payment_intent_id: string;
  amount: number;
  currency: string;
}

// Orders API endpoints - switches between mock and real API
export const ordersApi = {
  // Create new order
  createOrder: async (data: CreateOrderRequest): Promise<ApiResponse<Order>> => {
    if (shouldUseMockApi()) {
      return mockOrdersApi.createOrder(data);
    }

    const response = await apiClient.post<ApiResponse<Order>>('/orders', data);
    return response.data;
  },

  // Create payment intent
  createPaymentIntent: async (
    orderId: string
  ): Promise<ApiResponse<PaymentIntent>> => {
    if (shouldUseMockApi()) {
      return mockOrdersApi.createPaymentIntent(orderId);
    }

    const response = await apiClient.post<ApiResponse<PaymentIntent>>(
      `/orders/${orderId}/payment-intent`
    );
    return response.data;
  },

  // Get user's orders
  getOrders: async (
    page = 1,
    perPage = 10
  ): Promise<PaginatedResponse<Order>> => {
    if (shouldUseMockApi()) {
      return mockOrdersApi.getOrders(page, perPage);
    }

    const response = await apiClient.get<PaginatedResponse<Order>>(
      `/orders?page=${page}&per_page=${perPage}`
    );
    return response.data;
  },

  // Get single order
  getOrder: async (orderId: string): Promise<ApiResponse<Order>> => {
    if (shouldUseMockApi()) {
      return mockOrdersApi.getOrder(orderId);
    }

    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`);
    return response.data;
  },

  // Get order by number
  getOrderByNumber: async (orderNumber: string): Promise<ApiResponse<Order>> => {
    const response = await apiClient.get<ApiResponse<Order>>(
      `/orders/number/${orderNumber}`
    );
    return response.data;
  },

  // Cancel order
  cancelOrder: async (
    orderId: string,
    reason?: string
  ): Promise<ApiResponse<Order>> => {
    if (shouldUseMockApi()) {
      return mockOrdersApi.cancelOrder(orderId, reason);
    }

    const response = await apiClient.post<ApiResponse<Order>>(
      `/orders/${orderId}/cancel`,
      { reason }
    );
    return response.data;
  },

  // Request refund
  requestRefund: async (
    orderId: string,
    data: { reason: string; items?: string[] }
  ): Promise<ApiResponse<Order>> => {
    const response = await apiClient.post<ApiResponse<Order>>(
      `/orders/${orderId}/refund`,
      data
    );
    return response.data;
  },

  // Get order tracking info
  getTrackingInfo: async (
    orderId: string
  ): Promise<
    ApiResponse<{
      carrier: string;
      tracking_number: string;
      tracking_url: string;
      events: {
        status: string;
        location: string;
        timestamp: string;
        description: string;
      }[];
    }>
  > => {
    const response = await apiClient.get<
      ApiResponse<{
        carrier: string;
        tracking_number: string;
        tracking_url: string;
        events: {
          status: string;
          location: string;
          timestamp: string;
          description: string;
        }[];
      }>
    >(`/orders/${orderId}/tracking`);
    return response.data;
  },

  // Reorder
  reorder: async (orderId: string): Promise<ApiResponse<Order>> => {
    const response = await apiClient.post<ApiResponse<Order>>(
      `/orders/${orderId}/reorder`
    );
    return response.data;
  },

  // Get order statistics
  getOrderStats: async (): Promise<
    ApiResponse<{
      total_orders: number;
      total_spent: number;
      average_order_value: number;
      pending_orders: number;
    }>
  > => {
    if (shouldUseMockApi()) {
      return mockOrdersApi.getOrderStats();
    }

    const response = await apiClient.get<
      ApiResponse<{
        total_orders: number;
        total_spent: number;
        average_order_value: number;
        pending_orders: number;
      }>
    >('/orders/stats');
    return response.data;
  },
};
