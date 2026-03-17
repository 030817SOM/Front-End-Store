import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi, type CreateOrderRequest } from '@/lib/api/orders';
import { toast } from 'sonner';
import { cartKeys } from './useCart';

// Query keys
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (page: number, perPage: number) =>
    [...orderKeys.lists(), { page, perPage }] as const,
  detail: (id: string) => [...orderKeys.all, 'detail', id] as const,
  tracking: (id: string) => [...orderKeys.detail(id), 'tracking'] as const,
  stats: () => [...orderKeys.all, 'stats'] as const,
};

// Hook to get user's orders
export const useOrders = (page = 1, perPage = 10) => {
  return useQuery({
    queryKey: orderKeys.list(page, perPage),
    queryFn: () => ordersApi.getOrders(page, perPage),
    staleTime: 0,
  });
};

// Hook to get a single order
export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => ordersApi.getOrder(orderId),
    staleTime: 0,
    enabled: !!orderId,
  });
};

// Hook to get order by number
export const useOrderByNumber = (orderNumber: string) => {
  return useQuery({
    queryKey: [...orderKeys.all, 'number', orderNumber],
    queryFn: () => ordersApi.getOrderByNumber(orderNumber),
    staleTime: 0,
    enabled: !!orderNumber,
  });
};

// Hook to get order tracking
export const useOrderTracking = (orderId: string) => {
  return useQuery({
    queryKey: orderKeys.tracking(orderId),
    queryFn: () => ordersApi.getTrackingInfo(orderId),
    staleTime: 5 * 60 * 1000,
    enabled: !!orderId,
  });
};

// Hook to get order statistics
export const useOrderStats = () => {
  return useQuery({
    queryKey: orderKeys.stats(),
    queryFn: () => ordersApi.getOrderStats(),
    staleTime: 5 * 60 * 1000,
  });
};

// Hook to create order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => ordersApi.createOrder(data),
    onSuccess: (response) => {
      toast.success('Order placed successfully!');
      // Invalidate cart and orders queries
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      return response.data;
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to place order');
    },
  });
};

// Hook to create payment intent
export const useCreatePaymentIntent = () => {
  return useMutation({
    mutationFn: (orderId: string) => ordersApi.createPaymentIntent(orderId),
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create payment');
    },
  });
};

// Hook to cancel order
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason?: string }) =>
      ordersApi.cancelOrder(orderId, reason),
    onSuccess: (_, variables) => {
      toast.success('Order cancelled successfully');
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.orderId),
      });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to cancel order');
    },
  });
};

// Hook to request refund
export const useRequestRefund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      reason,
      items,
    }: {
      orderId: string;
      reason: string;
      items?: string[];
    }) => ordersApi.requestRefund(orderId, { reason, items }),
    onSuccess: (_, variables) => {
      toast.success('Refund request submitted');
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.orderId),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to request refund');
    },
  });
};

// Hook to reorder
export const useReorder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => ordersApi.reorder(orderId),
    onSuccess: () => {
      toast.success('Items added to cart!');
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reorder');
    },
  });
};
