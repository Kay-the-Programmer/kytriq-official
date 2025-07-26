import axios from 'axios';

// Define the base URL for API requests
const API_BASE_URL = 'http://localhost:3001/api';

// Add an interceptor to include the auth token in all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`Adding auth token to request: ${config.url}`);
    } else {
      console.warn(`No auth token found for request: ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to log unauthorized errors
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized error:', error.config.url, error);
    }
    return Promise.reject(error);
  }
);

// Custom API error class
export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Blog post interface (matching the backend model)
export interface BlogPost {
  id: string;
  title: string;
  author: string;
  authorAvatarUrl: string;
  date: string;
  tags: string[];
  imageUrl: string;
  excerpt: string;
  content: string;
}

// API functions for blog posts
export const getBlogPosts = async (signal?: AbortSignal): Promise<BlogPost[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/blog`, { signal });
    return response.data;
  } catch (error) {
    // Don't log or throw errors for canceled requests
    if (axios.isCancel(error)) {
      // Just return empty array for canceled requests without logging
      return [];
    }

    // Only log errors that are not cancellations
    console.error('Error fetching blog posts:', error);
    if (axios.isAxiosError(error)) {
      throw new ApiError(
        error.message || 'Failed to fetch blog posts',
        error.response?.status || 500,
        error.response?.data
      );
    }
    throw new ApiError('Failed to fetch blog posts', 500);
  }
};

export const getBlogPostById = async (id: string, signal?: AbortSignal): Promise<BlogPost | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/blog/${id}`, { signal });
    return response.data;
  } catch (error) {
    // Don't log or throw errors for canceled requests
    if (axios.isCancel(error)) {
      // Just return null for canceled requests without logging
      return null;
    }

    // Only log errors that are not cancellations
    console.error(`Error fetching blog post with id ${id}:`, error);
    if (axios.isAxiosError(error)) {
      throw new ApiError(
        error.message || `Failed to fetch blog post with id ${id}`,
        error.response?.status || 500,
        error.response?.data
      );
    }
    throw new ApiError(`Failed to fetch blog post with id ${id}`, 500);
  }
};

// Auth service for handling authentication
export const AuthService = {
  // Get the current logged-in user
  getCurrentUser: async (signal?: AbortSignal): Promise<any> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, { signal });
      return response.data;
    } catch (error) {
      // Don't log or throw errors for canceled requests
      if (axios.isCancel(error)) {
        // Just return null for canceled requests without logging
        return null;
      }

      // Handle 401 Unauthorized errors gracefully
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Return null instead of throwing an error for 401 responses
        // This allows the app to handle unauthenticated users without crashing
        return null;
      }

      // Only log errors that are not 401 or cancellations
      console.error('Error fetching current user:', error);

      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || 'Failed to fetch current user',
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError('Failed to fetch current user', 500);
    }
  },

  // Log in a user
  login: async (email: string, password: string): Promise<any> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || 'Failed to login',
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError('Failed to login', 500);
    }
  },

  // Logout the current user
  logout: async (): Promise<void> => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`);
    } catch (error) {
      console.error('Error logging out:', error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || 'Failed to logout',
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError('Failed to logout', 500);
    }
  },

  // Register a new user
  signup: async (fullName: string, email: string, password: string): Promise<any> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, { fullName, email, password });
      return response.data;
    } catch (error) {
      console.error('Error signing up:', error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || 'Failed to sign up',
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError('Failed to sign up', 500);
    }
  }
};

// Product service for handling product operations
export const ProductService = {
  getAll: async (params = {}, signal?: AbortSignal): Promise<any> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, { params, signal });
      return response.data;
    } catch (error) {
      // Don't log or throw errors for canceled requests
      if (axios.isCancel(error)) {
        // Just return empty array for canceled requests without logging
        return [];
      }

      // Only log errors that are not cancellations
      console.error('Error fetching products:', error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || 'Failed to fetch products',
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError('Failed to fetch products', 500);
    }
  },

  getById: async (id: string, signal?: AbortSignal): Promise<any> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${id}`, { signal });
      return response.data;
    } catch (error) {
      // Don't log or throw errors for canceled requests
      if (axios.isCancel(error)) {
        // Just return null for canceled requests without logging
        return null;
      }

      // Only log errors that are not cancellations
      console.error(`Error fetching product with id ${id}:`, error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || `Failed to fetch product with id ${id}`,
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError(`Failed to fetch product with id ${id}`, 500);
    }
  },

  create: async (product: any): Promise<any> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/products`, product);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || 'Failed to create product',
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError('Failed to create product', 500);
    }
  },

  update: async (id: string, product: any): Promise<any> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/products/${id}`, product);
      return response.data;
    } catch (error) {
      console.error(`Error updating product with id ${id}:`, error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || `Failed to update product with id ${id}`,
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError(`Failed to update product with id ${id}`, 500);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`);
    } catch (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || `Failed to delete product with id ${id}`,
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError(`Failed to delete product with id ${id}`, 500);
    }
  }
};

// Software service for handling software operations
export const SoftwareService = {
  getAll: async (params = {}, signal?: AbortSignal): Promise<any> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/software`, { params, signal });
      return response.data;
    } catch (error) {
      // Don't log or throw errors for canceled requests
      if (axios.isCancel(error)) {
        // Just return empty array for canceled requests without logging
        return [];
      }

      // Only log errors that are not cancellations
      console.error('Error fetching software products:', error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || 'Failed to fetch software products',
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError('Failed to fetch software products', 500);
    }
  },

  getById: async (id: string, signal?: AbortSignal): Promise<any> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/software/${id}`, { signal });
      return response.data;
    } catch (error) {
      // Don't log or throw errors for canceled requests
      if (axios.isCancel(error)) {
        // Just return null for canceled requests without logging
        return null;
      }

      // Only log errors that are not cancellations
      console.error(`Error fetching software with id ${id}:`, error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || `Failed to fetch software with id ${id}`,
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError(`Failed to fetch software with id ${id}`, 500);
    }
  },

  create: async (software: any): Promise<any> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/software`, software);
      return response.data;
    } catch (error) {
      console.error('Error creating software:', error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || 'Failed to create software',
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError('Failed to create software', 500);
    }
  },

  update: async (id: string, software: any): Promise<any> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/software/${id}`, software);
      return response.data;
    } catch (error) {
      console.error(`Error updating software with id ${id}:`, error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || `Failed to update software with id ${id}`,
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError(`Failed to update software with id ${id}`, 500);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/software/${id}`);
    } catch (error) {
      console.error(`Error deleting software with id ${id}:`, error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || `Failed to delete software with id ${id}`,
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError(`Failed to delete software with id ${id}`, 500);
    }
  }
};

// Blog service for handling blog operations
export const BlogService = {
  getAll: async (params = {}, signal?: AbortSignal): Promise<any> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blog`, { params, signal });
      return response.data;
    } catch (error) {
      // Don't log or throw errors for canceled requests
      if (axios.isCancel(error)) {
        // Just return empty array for canceled requests without logging
        return [];
      }

      // Only log errors that are not cancellations
      console.error('Error fetching blog posts:', error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || 'Failed to fetch blog posts',
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError('Failed to fetch blog posts', 500);
    }
  },

  getById: async (id: string, signal?: AbortSignal): Promise<any> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blog/${id}`, { signal });
      return response.data;
    } catch (error) {
      // Don't log or throw errors for canceled requests
      if (axios.isCancel(error)) {
        // Just return null for canceled requests without logging
        return null;
      }

      // Only log errors that are not cancellations
      console.error(`Error fetching blog post with id ${id}:`, error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || `Failed to fetch blog post with id ${id}`,
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError(`Failed to fetch blog post with id ${id}`, 500);
    }
  },

  create: async (post: any): Promise<any> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/blog`, post);
      return response.data;
    } catch (error) {
      console.error('Error creating blog post:', error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || 'Failed to create blog post',
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError('Failed to create blog post', 500);
    }
  },

  update: async (id: string, post: any): Promise<any> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/blog/${id}`, post);
      return response.data;
    } catch (error) {
      console.error(`Error updating blog post with id ${id}:`, error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || `Failed to update blog post with id ${id}`,
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError(`Failed to update blog post with id ${id}`, 500);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/blog/${id}`);
    } catch (error) {
      console.error(`Error deleting blog post with id ${id}:`, error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || `Failed to delete blog post with id ${id}`,
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError(`Failed to delete blog post with id ${id}`, 500);
    }
  }
};

// Career service for handling job and application operations
export const CareerService = {
  getAll: async (params = {}, signal?: AbortSignal): Promise<any> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/careers`, { params, signal });
      return response.data;
    } catch (error) {
      // Don't log or throw errors for canceled requests
      if (axios.isCancel(error)) {
        // Just return empty array for canceled requests without logging
        return [];
      }

      // Only log errors that are not cancellations
      console.error('Error fetching job openings:', error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || 'Failed to fetch job openings',
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError('Failed to fetch job openings', 500);
    }
  },

  getById: async (id: string, signal?: AbortSignal): Promise<any> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/careers/${id}`, { signal });
      return response.data;
    } catch (error) {
      // Don't log or throw errors for canceled requests
      if (axios.isCancel(error)) {
        // Just return null for canceled requests without logging
        return null;
      }

      // Only log errors that are not cancellations
      console.error(`Error fetching job with id ${id}:`, error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || `Failed to fetch job with id ${id}`,
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError(`Failed to fetch job with id ${id}`, 500);
    }
  },

  create: async (job: any): Promise<any> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/careers`, job);
      return response.data;
    } catch (error) {
      console.error('Error creating job:', error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || 'Failed to create job',
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError('Failed to create job', 500);
    }
  },

  update: async (id: string, job: any): Promise<any> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/careers/${id}`, job);
      return response.data;
    } catch (error) {
      console.error(`Error updating job with id ${id}:`, error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || `Failed to update job with id ${id}`,
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError(`Failed to update job with id ${id}`, 500);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/careers/${id}`);
    } catch (error) {
      console.error(`Error deleting job with id ${id}:`, error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || `Failed to delete job with id ${id}`,
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError(`Failed to delete job with id ${id}`, 500);
    }
  }
};

// Order service for handling order operations
export const OrderService = {
  getAll: async (params = {}, signal?: AbortSignal): Promise<any> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`, { params, signal });
      return response.data;
    } catch (error) {
      // Don't log or throw errors for canceled requests
      if (axios.isCancel(error)) {
        // Just return empty array for canceled requests without logging
        return [];
      }

      // Only log errors that are not cancellations
      console.error('Error fetching orders:', error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || 'Failed to fetch orders',
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError('Failed to fetch orders', 500);
    }
  },

  getById: async (id: string, signal?: AbortSignal): Promise<any> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/${id}`, { signal });
      return response.data;
    } catch (error) {
      // Don't log or throw errors for canceled requests
      if (axios.isCancel(error)) {
        // Just return null for canceled requests without logging
        return null;
      }

      // Only log errors that are not cancellations
      console.error(`Error fetching order with id ${id}:`, error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || `Failed to fetch order with id ${id}`,
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError(`Failed to fetch order with id ${id}`, 500);
    }
  },

  create: async (order: any): Promise<any> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/orders`, order);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || 'Failed to create order',
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError('Failed to create order', 500);
    }
  },

  updateStatus: async (id: string, status: string): Promise<any> => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating order status with id ${id}:`, error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || `Failed to update order status with id ${id}`,
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError(`Failed to update order status with id ${id}`, 500);
    }
  }
};

// User service for handling user operations
export const UserService = {
  getAll: async (params = {}, signal?: AbortSignal): Promise<any> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`, { params, signal });
      return response.data;
    } catch (error) {
      // Don't log or throw errors for canceled requests
      if (axios.isCancel(error)) {
        // Just return empty array for canceled requests without logging
        return [];
      }

      // Only log errors that are not cancellations
      console.error('Error fetching users:', error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || 'Failed to fetch users',
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError('Failed to fetch users', 500);
    }
  },

  getById: async (id: string, signal?: AbortSignal): Promise<any> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${id}`, { signal });
      return response.data;
    } catch (error) {
      // Don't log or throw errors for canceled requests
      if (axios.isCancel(error)) {
        // Just return null for canceled requests without logging
        return null;
      }

      // Only log errors that are not cancellations
      console.error(`Error fetching user with id ${id}:`, error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || `Failed to fetch user with id ${id}`,
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError(`Failed to fetch user with id ${id}`, 500);
    }
  },

  create: async (user: any): Promise<any> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users`, user);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || 'Failed to create user',
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError('Failed to create user', 500);
    }
  },

  update: async (id: string, user: any): Promise<any> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/${id}`, user);
      return response.data;
    } catch (error) {
      console.error(`Error updating user with id ${id}:`, error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || `Failed to update user with id ${id}`,
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError(`Failed to update user with id ${id}`, 500);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/users/${id}`);
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || `Failed to delete user with id ${id}`,
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError(`Failed to delete user with id ${id}`, 500);
    }
  }
};

// Gemini AI service for content generation
export const GeminiService = {
  // Generate blog content based on title and tags
  generateBlogContent: async (title: string, tags: string[], signal?: AbortSignal): Promise<any> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/generate-blog`, { title, tags }, { signal });
      return response.data;
    } catch (error) {
      // Don't log or throw errors for canceled requests
      if (axios.isCancel(error)) {
        // Just return null for canceled requests without logging
        return null;
      }

      // Only log errors that are not cancellations
      console.error('Error generating blog content:', error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || 'Failed to generate blog content',
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError('Failed to generate blog content', 500);
    }
  },

  // Generate job description based on title and department
  generateJobContent: async (title: string, department: string, signal?: AbortSignal): Promise<any> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/generate-job`, { title, department }, { signal });
      return response.data;
    } catch (error) {
      // Don't log or throw errors for canceled requests
      if (axios.isCancel(error)) {
        // Just return null for canceled requests without logging
        return null;
      }

      // Only log errors that are not cancellations
      console.error('Error generating job content:', error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || 'Failed to generate job content',
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError('Failed to generate job content', 500);
    }
  },

  // Generate product description based on name and category
  generateProductDescription: async (name: string, category: string, signal?: AbortSignal): Promise<any> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/generate-product`, { name, category }, { signal });
      return response.data;
    } catch (error) {
      // Don't log or throw errors for canceled requests
      if (axios.isCancel(error)) {
        // Just return null for canceled requests without logging
        return null;
      }

      // Only log errors that are not cancellations
      console.error('Error generating product description:', error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message || 'Failed to generate product description',
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw new ApiError('Failed to generate product description', 500);
    }
  }
};

// Additional API functions can be added here for other entities
