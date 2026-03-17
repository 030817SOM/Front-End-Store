import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi, type AddToCartRequest, type UpdateCartItemRequest } from '@/lib/api/cart';
import { toast } from 'sonner';

// Query keys
export const cartKeys = {
  all: ['cart'] as const,
  detail: () => [...cartKeys.all, 'detail'] as const,
};

// Hook to get cart
export const useCart = () => {
  return useQuery({
    queryKey: cartKeys.detail(),
    queryFn: () => cartApi.getCart(),
    staleTime: 0, // Always fresh
    refetchOnWindowFocus: true,
  });
};

// Hook to add item to cart
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToCartRequest) => cartApi.addItem(data),
    onSuccess: (response) => {
      toast.success('Item added to cart!');
      queryClient.setQueryData(cartKeys.detail(), response);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add item to cart');
    },
  });
};

// Hook to update cart item
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      data,
    }: {
      itemId: string;
      data: UpdateCartItemRequest;
    }) => cartApi.updateItem(itemId, data),
    onSuccess: (response) => {
      queryClient.setQueryData(cartKeys.detail(), response);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update cart');
    },
  });
};

// Hook to remove item from cart
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => cartApi.removeItem(itemId),
    onSuccess: (response) => {
      toast.success('Item removed from cart');
      queryClient.setQueryData(cartKeys.detail(), response);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove item');
    },
  });
};

// Hook to clear cart
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartApi.clearCart(),
    onSuccess: (response) => {
      toast.success('Cart cleared');
      queryClient.setQueryData(cartKeys.detail(), response);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to clear cart');
    },
  });
};

// Hook to apply coupon
export const useApplyCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => cartApi.applyCoupon(code),
    onSuccess: (response) => {
      toast.success('Coupon applied!');
      queryClient.setQueryData(cartKeys.detail(), response);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Invalid coupon code');
    },
  });
};

// Hook to remove coupon
export const useRemoveCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartApi.removeCoupon(),
    onSuccess: (response) => {
      toast.success('Coupon removed');
      queryClient.setQueryData(cartKeys.detail(), response);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove coupon');
    },
  });
};

// Hook to sync cart
export const useSyncCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: { product_id: string; quantity: number }[]) =>
      cartApi.syncCart(items),
    onSuccess: (response) => {
      queryClient.setQueryData(cartKeys.detail(), response);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to sync cart');
    },
  });
};

// Hook to get shipping estimates
export const useShippingEstimates = () => {
  return useMutation({
    mutationFn: ({
      country,
      postalCode,
    }: {
      country: string;
      postalCode: string;
    }) => cartApi.getShippingEstimates(country, postalCode),
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to get shipping estimates');
    },
  });
};
