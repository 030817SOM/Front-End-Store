import { apiClient } from './client';
import { mockProductsApi } from './mock';
import { shouldUseMockApi } from './config';
import type { ApiResponse, PaginatedResponse } from './client';
import type { Product } from '@/store/cartStore';

export interface ProductFilters {
  category?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  sort_by?: 'price' | 'name' | 'rating' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  product_count: number;
}

export interface Review {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  product_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

// Product API endpoints - switches between mock and real API
export const productsApi = {
  // Get all products with pagination and filters
  getProducts: async (
    page = 1,
    perPage = 12,
    filters: ProductFilters = {}
  ): Promise<PaginatedResponse<Product>> => {
    if (shouldUseMockApi()) {
      return mockProductsApi.getProducts(page, perPage, filters);
    }

    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      ...Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== '') {
          acc[key] = value.toString();
        }
        return acc;
      }, {} as Record<string, string>),
    });

    const response = await apiClient.get<PaginatedResponse<Product>>(
      `/products?${params}`
    );
    return response.data;
  },

  // Get single product by ID
  getProduct: async (id: string): Promise<ApiResponse<Product & { 
    description: string;
    specifications: Record<string, string>;
    images: string[];
    in_stock: number;
    reviews_count: number;
    reviews: Review[];
  }>> => {
    if (shouldUseMockApi()) {
      return mockProductsApi.getProduct(id);
    }

    const response = await apiClient.get<ApiResponse<Product & {
      description: string;
      specifications: Record<string, string>;
      images: string[];
      in_stock: number;
      reviews_count: number;
      reviews: Review[];
    }>>(`/products/${id}`);
    return response.data;
  },

  // Get product by slug
  getProductBySlug: async (slug: string): Promise<ApiResponse<Product>> => {
    if (shouldUseMockApi()) {
      // For mock, treat slug as id
      return mockProductsApi.getProduct(slug);
    }

    const response = await apiClient.get<ApiResponse<Product>>(`/products/slug/${slug}`);
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async (limit = 8): Promise<ApiResponse<Product[]>> => {
    if (shouldUseMockApi()) {
      return mockProductsApi.getFeaturedProducts(limit);
    }

    const response = await apiClient.get<ApiResponse<Product[]>>(
      `/products/featured?limit=${limit}`
    );
    return response.data;
  },

  // Get new arrivals
  getNewArrivals: async (limit = 8): Promise<ApiResponse<Product[]>> => {
    if (shouldUseMockApi()) {
      return mockProductsApi.getNewArrivals(limit);
    }

    const response = await apiClient.get<ApiResponse<Product[]>>(
      `/products/new?limit=${limit}`
    );
    return response.data;
  },

  // Get bestsellers
  getBestsellers: async (limit = 8): Promise<ApiResponse<Product[]>> => {
    if (shouldUseMockApi()) {
      return mockProductsApi.getBestsellers(limit);
    }

    const response = await apiClient.get<ApiResponse<Product[]>>(
      `/products/bestsellers?limit=${limit}`
    );
    return response.data;
  },

  // Get related products
  getRelatedProducts: async (
    productId: string,
    limit = 4
  ): Promise<ApiResponse<Product[]>> => {
    if (shouldUseMockApi()) {
      return mockProductsApi.getRelatedProducts(productId, limit);
    }

    const response = await apiClient.get<ApiResponse<Product[]>>(
      `/products/${productId}/related?limit=${limit}`
    );
    return response.data;
  },

  // Search products
  searchProducts: async (
    query: string,
    page = 1,
    perPage = 12
  ): Promise<PaginatedResponse<Product>> => {
    if (shouldUseMockApi()) {
      return mockProductsApi.searchProducts(query, page, perPage);
    }

    const response = await apiClient.get<PaginatedResponse<Product>>(
      `/products/search?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`
    );
    return response.data;
  },

  // Get product categories
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    if (shouldUseMockApi()) {
      return mockProductsApi.getCategories();
    }

    const response = await apiClient.get<ApiResponse<Category[]>>('/categories');
    return response.data;
  },

  // Get category by slug
  getCategory: async (slug: string): Promise<ApiResponse<Category>> => {
    if (shouldUseMockApi()) {
      return mockProductsApi.getCategory(slug);
    }

    const response = await apiClient.get<ApiResponse<Category>>(`/categories/${slug}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (
    categorySlug: string,
    page = 1,
    perPage = 12
  ): Promise<PaginatedResponse<Product>> => {
    if (shouldUseMockApi()) {
      return mockProductsApi.getProductsByCategory(categorySlug, page, perPage);
    }

    const response = await apiClient.get<PaginatedResponse<Product>>(
      `/categories/${categorySlug}/products?page=${page}&per_page=${perPage}`
    );
    return response.data;
  },

  // Add product review
  addReview: async (
    productId: string,
    data: { rating: number; comment: string }
  ): Promise<ApiResponse<Review>> => {
    const response = await apiClient.post<ApiResponse<Review>>(
      `/products/${productId}/reviews`,
      data
    );
    return response.data;
  },

  // Get product reviews
  getReviews: async (
    productId: string,
    page = 1,
    perPage = 10
  ): Promise<PaginatedResponse<Review>> => {
    if (shouldUseMockApi()) {
      return mockProductsApi.getReviews(productId, page, perPage);
    }

    const response = await apiClient.get<PaginatedResponse<Review>>(
      `/products/${productId}/reviews?page=${page}&per_page=${perPage}`
    );
    return response.data;
  },
};
