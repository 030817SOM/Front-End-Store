import { products, categories } from '@/data/products';
import type { Product } from '@/store/cartStore';
import type { ApiResponse, PaginatedResponse } from './client';
import type { Category, Review } from './products';
import type { Cart } from './cart';
import type { Order, ShippingAddress, BillingAddress } from './orders';
import type { User } from './auth';

// Mock delay to simulate network
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate mock reviews
const generateReviews = (productId: string, count: number): Review[] => {
  const reviewers = [
    { name: 'Alex Chen', avatar: 'AC' },
    { name: 'Sarah Kim', avatar: 'SK' },
    { name: 'Marcus Johnson', avatar: 'MJ' },
    { name: 'Emily Davis', avatar: 'ED' },
    { name: 'James Wilson', avatar: 'JW' },
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `review-${productId}-${i}`,
    user_id: `user-${i}`,
    user_name: reviewers[i % reviewers.length].name,
    user_avatar: reviewers[i % reviewers.length].avatar,
    product_id: productId,
    rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
    comment: [
      'Absolutely love this product! The quality is amazing.',
      'Great value for money. Would definitely recommend.',
      'Exceeded my expectations. Fast shipping too!',
      'Perfect fit and looks even better in person.',
      'Best purchase I\'ve made this year!',
    ][i % 5],
    created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

// Mock Products API
export const mockProductsApi = {
  getProducts: async (
    page = 1,
    perPage = 12,
    filters: { category?: string; min_price?: number; max_price?: number; search?: string; sort_by?: string; sort_order?: string } = {}
  ): Promise<PaginatedResponse<Product>> => {
    await delay(300);

    let filteredProducts = [...products];

    // Apply filters
    if (filters.category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category === filters.category
      );
    }

    if (filters.min_price) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price >= filters.min_price!
      );
    }

    if (filters.max_price) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price <= filters.max_price!
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    if (filters.sort_by) {
      filteredProducts.sort((a, b) => {
        let comparison = 0;
        switch (filters.sort_by) {
          case 'price':
            comparison = a.price - b.price;
            break;
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'rating':
            comparison = a.rating - b.rating;
            break;
          default:
            comparison = 0;
        }
        return filters.sort_order === 'desc' ? -comparison : comparison;
      });
    }

    const total = filteredProducts.length;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedProducts = filteredProducts.slice(start, end);

    return {
      data: paginatedProducts,
      meta: {
        current_page: page,
        last_page: Math.ceil(total / perPage),
        per_page: perPage,
        total,
      },
      links: {
        first: `?page=1`,
        last: `?page=${Math.ceil(total / perPage)}`,
        prev: page > 1 ? `?page=${page - 1}` : null,
        next: end < total ? `?page=${page + 1}` : null,
      },
    };
  },

  getProduct: async (id: string): Promise<ApiResponse<Product & {
    description: string;
    specifications: Record<string, string>;
    images: string[];
    in_stock: number;
    reviews_count: number;
    reviews: Review[];
  }>> => {
    await delay(200);

    const product = products.find((p) => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }

    const productData = {
      ...product,
      description: product.description || 'Premium quality futuristic techwear product.',
      specifications: {
        Material: 'High-grade synthetic polymers',
        Weight: '450g',
        Dimensions: '30 x 20 x 10 cm',
        Warranty: '2 years',
        'Made in': 'Neo-Tokyo',
      },
      images: [product.image, product.image, product.image],
      in_stock: Math.floor(Math.random() * 50) + 10,
      reviews_count: 128,
      reviews: generateReviews(id, 5),
    };

    return {
      data: productData as unknown as Product & {
        description: string;
        specifications: Record<string, string>;
        images: string[];
        in_stock: number;
        reviews_count: number;
        reviews: Review[];
      },
    };
  },

  getFeaturedProducts: async (limit = 8): Promise<ApiResponse<Product[]>> => {
    await delay(200);
    return {
      data: products.slice(0, limit),
    };
  },

  getNewArrivals: async (limit = 8): Promise<ApiResponse<Product[]>> => {
    await delay(200);
    return {
      data: products.slice(0, limit).reverse(),
    };
  },

  getBestsellers: async (limit = 8): Promise<ApiResponse<Product[]>> => {
    await delay(200);
    return {
      data: products
        .sort((a, b) => b.reviews - a.reviews)
        .slice(0, limit),
    };
  },

  getRelatedProducts: async (productId: string, limit = 4): Promise<ApiResponse<Product[]>> => {
    await delay(200);
    const related = products
      .filter((p) => p.id !== productId)
      .slice(0, limit);
    return {
      data: related,
    };
  },

  searchProducts: async (
    query: string,
    page = 1,
    perPage = 12
  ): Promise<PaginatedResponse<Product>> => {
    return mockProductsApi.getProducts(page, perPage, { search: query });
  },

  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    await delay(150);
    return {
      data: categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.id,
        image: c.image,
        description: `Explore our ${c.name.toLowerCase()} collection.`,
        product_count: c.count,
      })),
    };
  },

  getCategory: async (slug: string): Promise<ApiResponse<Category>> => {
    await delay(150);
    const category = categories.find((c) => c.id === slug);
    if (!category) {
      throw new Error('Category not found');
    }
    return {
      data: {
        id: category.id,
        name: category.name,
        slug: category.id,
        image: category.image,
        description: `Explore our ${category.name.toLowerCase()} collection.`,
        product_count: category.count,
      },
    };
  },

  getProductsByCategory: async (
    categorySlug: string,
    page = 1,
    perPage = 12
  ): Promise<PaginatedResponse<Product>> => {
    return mockProductsApi.getProducts(page, perPage, { category: categorySlug });
  },

  getReviews: async (
    productId: string,
    page = 1,
    perPage = 10
  ): Promise<PaginatedResponse<Review>> => {
    await delay(200);
    const reviews = generateReviews(productId, 20);
    const start = (page - 1) * perPage;
    const end = start + perPage;

    return {
      data: reviews.slice(start, end),
      meta: {
        current_page: page,
        last_page: Math.ceil(reviews.length / perPage),
        per_page: perPage,
        total: reviews.length,
      },
      links: {
        first: `?page=1`,
        last: `?page=${Math.ceil(reviews.length / perPage)}`,
        prev: page > 1 ? `?page=${page - 1}` : null,
        next: end < reviews.length ? `?page=${page + 1}` : null,
      },
    };
  },
};

// Mock Cart API
let mockCart: Cart = {
  id: 'cart-1',
  items: [],
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0,
  item_count: 0,
};

export const mockCartApi = {
  getCart: async (): Promise<ApiResponse<Cart>> => {
    await delay(150);
    return { data: mockCart };
  },

  addItem: async (data: { product_id: string; quantity: number }): Promise<ApiResponse<Cart>> => {
    await delay(200);
    const product = products.find((p) => p.id === data.product_id);
    if (!product) {
      throw new Error('Product not found');
    }

    const existingItem = mockCart.items.find((item) => item.id === data.product_id);
    if (existingItem) {
      existingItem.quantity += data.quantity;
    } else {
      mockCart.items.push({ ...product, quantity: data.quantity });
    }

    mockCart.item_count = mockCart.items.reduce((sum, item) => sum + item.quantity, 0);
    mockCart.subtotal = mockCart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    mockCart.tax = mockCart.subtotal * 0.1;
    mockCart.shipping = mockCart.subtotal > 100 ? 0 : 15;
    mockCart.total = mockCart.subtotal + mockCart.tax + mockCart.shipping;

    return { data: mockCart };
  },

  updateItem: async (
    itemId: string,
    data: { quantity: number }
  ): Promise<ApiResponse<Cart>> => {
    await delay(150);
    const item = mockCart.items.find((i) => i.id === itemId);
    if (!item) {
      throw new Error('Item not found');
    }

    item.quantity = data.quantity;

    mockCart.item_count = mockCart.items.reduce((sum, item) => sum + item.quantity, 0);
    mockCart.subtotal = mockCart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    mockCart.tax = mockCart.subtotal * 0.1;
    mockCart.shipping = mockCart.subtotal > 100 ? 0 : 15;
    mockCart.total = mockCart.subtotal + mockCart.tax + mockCart.shipping;

    return { data: mockCart };
  },

  removeItem: async (itemId: string): Promise<ApiResponse<Cart>> => {
    await delay(150);
    mockCart.items = mockCart.items.filter((i) => i.id !== itemId);

    mockCart.item_count = mockCart.items.reduce((sum, item) => sum + item.quantity, 0);
    mockCart.subtotal = mockCart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    mockCart.tax = mockCart.subtotal * 0.1;
    mockCart.shipping = mockCart.subtotal > 100 ? 0 : 15;
    mockCart.total = mockCart.subtotal + mockCart.tax + mockCart.shipping;

    return { data: mockCart };
  },

  clearCart: async (): Promise<ApiResponse<Cart>> => {
    await delay(150);
    mockCart = {
      id: 'cart-1',
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
      item_count: 0,
    };
    return { data: mockCart };
  },

  applyCoupon: async (code: string): Promise<ApiResponse<Cart>> => {
    await delay(200);
    if (code.toLowerCase() === 'nexus20') {
      mockCart.coupon = {
        code: 'NEXUS20',
        discount: 20,
        type: 'percentage',
      };
      const discount = mockCart.subtotal * 0.2;
      mockCart.total = mockCart.subtotal + mockCart.tax + mockCart.shipping - discount;
    } else {
      throw new Error('Invalid coupon code');
    }
    return { data: mockCart };
  },

  removeCoupon: async (): Promise<ApiResponse<Cart>> => {
    await delay(150);
    delete mockCart.coupon;
    mockCart.total = mockCart.subtotal + mockCart.tax + mockCart.shipping;
    return { data: mockCart };
  },

  syncCart: async (items: { product_id: string; quantity: number }[]): Promise<ApiResponse<Cart>> => {
    await delay(200);
    mockCart.items = items
      .map((item) => {
        const product = products.find((p) => p.id === item.product_id);
        return product ? { ...product, quantity: item.quantity } : null;
      })
      .filter((item): item is Product & { quantity: number } => item !== null);

    mockCart.item_count = mockCart.items.reduce((sum, item) => sum + item.quantity, 0);
    mockCart.subtotal = mockCart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    mockCart.tax = mockCart.subtotal * 0.1;
    mockCart.shipping = mockCart.subtotal > 100 ? 0 : 15;
    mockCart.total = mockCart.subtotal + mockCart.tax + mockCart.shipping;

    return { data: mockCart };
  },
};

// Mock Orders API
const mockOrders: Order[] = [];

export const mockOrdersApi = {
  createOrder: async (_data: {
    shipping_address: ShippingAddress;
    billing_address: BillingAddress;
    shipping_method_id: string;
    payment_method_id: string;
    coupon_code?: string;
    notes?: string;
  }): Promise<ApiResponse<Order>> => {
    await delay(500);

    const order: Order = {
      id: `order-${Date.now()}`,
      order_number: `NX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: 'pending',
      payment_status: 'pending',
      items: mockCart.items.map((item) => ({
        ...item,
        order_id: `order-${Date.now()}`,
        price_at_time: item.price,
      })),
      subtotal: mockCart.subtotal,
      tax: mockCart.tax,
      shipping: mockCart.shipping,
      discount: mockCart.coupon ? mockCart.subtotal * 0.2 : 0,
      total: mockCart.total,
      currency: 'USD',
      shipping_address: _data.shipping_address,
      billing_address: _data.billing_address,
      shipping_method: {
        id: _data.shipping_method_id,
        name: 'Express Shipping',
        price: mockCart.shipping,
      },
      coupon_code: _data.coupon_code,
      notes: _data.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockOrders.push(order);

    // Clear cart after order
    mockCart = {
      id: 'cart-1',
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
      item_count: 0,
    };

    return { data: order };
  },

  createPaymentIntent: async (_orderId: string): Promise<ApiResponse<{ client_secret: string; payment_intent_id: string; amount: number; currency: string }>> => {
    await delay(300);
    return {
      data: {
        client_secret: `pi_${Math.random().toString(36).substr(2, 24)}_secret_${Math.random().toString(36).substr(2, 24)}`,
        payment_intent_id: `pi_${Math.random().toString(36).substr(2, 24)}`,
        amount: mockCart.total * 100, // cents
        currency: 'usd',
      },
    };
  },

  getOrders: async (page = 1, perPage = 10): Promise<PaginatedResponse<Order>> => {
    await delay(200);
    const start = (page - 1) * perPage;
    const end = start + perPage;

    return {
      data: mockOrders.slice(start, end),
      meta: {
        current_page: page,
        last_page: Math.ceil(mockOrders.length / perPage),
        per_page: perPage,
        total: mockOrders.length,
      },
      links: {
        first: `?page=1`,
        last: `?page=${Math.ceil(mockOrders.length / perPage)}`,
        prev: page > 1 ? `?page=${page - 1}` : null,
        next: end < mockOrders.length ? `?page=${page + 1}` : null,
      },
    };
  },

  getOrder: async (orderId: string): Promise<ApiResponse<Order>> => {
    await delay(200);
    const order = mockOrders.find((o) => o.id === orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    return { data: order };
  },

  cancelOrder: async (orderId: string, _reason?: string): Promise<ApiResponse<Order>> => {
    await delay(200);
    const order = mockOrders.find((o) => o.id === orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    order.status = 'cancelled';
    order.updated_at = new Date().toISOString();
    return { data: order };
  },

  getOrderStats: async (): Promise<ApiResponse<{ total_orders: number; total_spent: number; average_order_value: number; pending_orders: number }>> => {
    await delay(150);
    const totalSpent = mockOrders.reduce((sum, o) => sum + o.total, 0);
    return {
      data: {
        total_orders: mockOrders.length,
        total_spent: totalSpent,
        average_order_value: mockOrders.length > 0 ? totalSpent / mockOrders.length : 0,
        pending_orders: mockOrders.filter((o) => o.status === 'pending').length,
      },
    };
  },
};

// Mock Auth API
let mockUser: User | null = null;

export const mockAuthApi = {
  login: async (_data: { email: string; password: string }): Promise<ApiResponse<{ user: User; token: string; refresh_token: string; expires_in: number }>> => {
    await delay(500);
    mockUser = {
      id: 'user-1',
      email: _data.email,
      first_name: 'John',
      last_name: 'Doe',
      avatar: 'JD',
      phone: '+1 555 123 4567',
      created_at: new Date().toISOString(),
    };
    return {
      data: {
        user: mockUser,
        token: `token_${Math.random().toString(36).substr(2, 32)}`,
        refresh_token: `refresh_${Math.random().toString(36).substr(2, 32)}`,
        expires_in: 3600,
      },
    };
  },

  register: async (_data: { email: string; password: string; first_name: string; last_name: string }): Promise<ApiResponse<{ user: User; token: string; refresh_token: string; expires_in: number }>> => {
    await delay(500);
    mockUser = {
      id: 'user-1',
      email: _data.email,
      first_name: _data.first_name,
      last_name: _data.last_name,
      avatar: `${_data.first_name[0]}${_data.last_name[0]}`,
      created_at: new Date().toISOString(),
    };
    return {
      data: {
        user: mockUser,
        token: `token_${Math.random().toString(36).substr(2, 32)}`,
        refresh_token: `refresh_${Math.random().toString(36).substr(2, 32)}`,
        expires_in: 3600,
      },
    };
  },

  logout: async (): Promise<void> => {
    await delay(200);
    mockUser = null;
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    await delay(200);
    if (!mockUser) {
      throw new Error('Not authenticated');
    }
    return { data: mockUser };
  },

  forgotPassword: async (_data: { email: string }): Promise<ApiResponse<void>> => {
    await delay(300);
    return { data: undefined };
  },

  resetPassword: async (_data: { email: string; token: string; password: string }): Promise<ApiResponse<void>> => {
    await delay(300);
    return { data: undefined };
  },

  updateProfile: async (_data: { first_name?: string; last_name?: string; phone?: string }): Promise<ApiResponse<User>> => {
    await delay(300);
    if (!mockUser) {
      throw new Error('Not authenticated');
    }
    mockUser = { ...mockUser, ..._data };
    return { data: mockUser };
  },

  changePassword: async (_data: { current_password: string; password: string }): Promise<ApiResponse<void>> => {
    await delay(300);
    return { data: undefined };
  },
};
