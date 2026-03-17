import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi, type ProductFilters } from '@/lib/api/products';
import { toast } from 'sonner';

// Query keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters & { page?: number; perPage?: number }) =>
    [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  featured: () => [...productKeys.all, 'featured'] as const,
  new: () => [...productKeys.all, 'new'] as const,
  bestsellers: () => [...productKeys.all, 'bestsellers'] as const,
  search: (query: string) => [...productKeys.all, 'search', query] as const,
  related: (id: string) => [...productKeys.detail(id), 'related'] as const,
  reviews: (id: string) => [...productKeys.detail(id), 'reviews'] as const,
};

// Hook to get all products with pagination and filters
export const useProducts = (
  page = 1,
  perPage = 12,
  filters: ProductFilters = {}
) => {
  return useQuery({
    queryKey: productKeys.list({ page, perPage, ...filters }),
    queryFn: () => productsApi.getProducts(page, perPage, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData,
  });
};

// Hook to get a single product
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productsApi.getProduct(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
};

// Hook to get featured products
export const useFeaturedProducts = (limit = 8) => {
  return useQuery({
    queryKey: productKeys.featured(),
    queryFn: () => productsApi.getFeaturedProducts(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get new arrivals
export const useNewArrivals = (limit = 8) => {
  return useQuery({
    queryKey: productKeys.new(),
    queryFn: () => productsApi.getNewArrivals(limit),
    staleTime: 10 * 60 * 1000,
  });
};

// Hook to get bestsellers
export const useBestsellers = (limit = 8) => {
  return useQuery({
    queryKey: productKeys.bestsellers(),
    queryFn: () => productsApi.getBestsellers(limit),
    staleTime: 10 * 60 * 1000,
  });
};

// Hook to search products
export const useSearchProducts = (
  query: string,
  page = 1,
  perPage = 12
) => {
  return useQuery({
    queryKey: productKeys.search(query),
    queryFn: () => productsApi.searchProducts(query, page, perPage),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: query.length > 2, // Only search if query is at least 3 characters
  });
};

// Hook to get related products
export const useRelatedProducts = (productId: string, limit = 4) => {
  return useQuery({
    queryKey: productKeys.related(productId),
    queryFn: () => productsApi.getRelatedProducts(productId, limit),
    staleTime: 5 * 60 * 1000,
    enabled: !!productId,
  });
};

// Hook to get product reviews
export const useProductReviews = (
  productId: string,
  page = 1,
  perPage = 10
) => {
  return useQuery({
    queryKey: [...productKeys.reviews(productId), { page, perPage }],
    queryFn: () => productsApi.getReviews(productId, page, perPage),
    staleTime: 2 * 60 * 1000,
    enabled: !!productId,
  });
};

// Hook to add a review
export const useAddReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: { rating: number; comment: string };
    }) => productsApi.addReview(productId, data),
    onSuccess: (_, variables) => {
      toast.success('Review added successfully!');
      // Invalidate reviews and product queries
      queryClient.invalidateQueries({
        queryKey: productKeys.reviews(variables.productId),
      });
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.productId),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add review');
    },
  });
};
