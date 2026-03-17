import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api/products';

// Query keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  detail: (slug: string) => [...categoryKeys.all, 'detail', slug] as const,
  products: (slug: string) => [...categoryKeys.detail(slug), 'products'] as const,
};

// Hook to get all categories
export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: () => productsApi.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes - categories don't change often
  });
};

// Hook to get a single category
export const useCategory = (slug: string) => {
  return useQuery({
    queryKey: categoryKeys.detail(slug),
    queryFn: () => productsApi.getCategory(slug),
    staleTime: 30 * 60 * 1000,
    enabled: !!slug,
  });
};

// Hook to get products by category
export const useCategoryProducts = (
  categorySlug: string,
  page = 1,
  perPage = 12
) => {
  return useQuery({
    queryKey: [...categoryKeys.products(categorySlug), { page, perPage }],
    queryFn: () => productsApi.getProductsByCategory(categorySlug, page, perPage),
    staleTime: 5 * 60 * 1000,
    enabled: !!categorySlug,
  });
};
