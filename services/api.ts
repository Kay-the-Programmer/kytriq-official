import axios from 'axios';

// Define the base URL for API requests
const API_BASE_URL = 'http://localhost:3001/api';

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

// Request interceptor to add the auth token
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Generic CRUD service factory
const createCrudService = <T>(endpoint: string) => ({
  getAll: async (params: { [key: string]: any } = {}): Promise<T[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${endpoint}`, { ...params });
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) return [];
      console.error(`Error fetching ${endpoint}:`, error);
      throw new ApiError(`Failed to fetch ${endpoint}`, (error as any).response?.status || 500, (error as any).response?.data);
    }
  },
  getById: async (id: string, params: { [key: string]: any } = {}): Promise<T | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${endpoint}/${id}`, { ...params });
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) return null;
      console.error(`Error fetching ${endpoint} with id ${id}:`, error);
      throw new ApiError(`Failed to fetch ${endpoint} with id ${id}`, (error as any).response?.status || 500, (error as any).response?.data);
    }
  },
  create: async (data: Partial<T>): Promise<T> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${endpoint}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error creating ${endpoint}:`, error);
      throw new ApiError(`Failed to create ${endpoint}`, (error as any).response?.status || 500, (error as any).response?.data);
    }
  },
  update: async (id: string, data: Partial<T>): Promise<T> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating ${endpoint} with id ${id}:`, error);
      throw new ApiError(`Failed to update ${endpoint} with id ${id}`, (error as any).response?.status || 500, (error as any).response?.data);
    }
  },
  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/${endpoint}/${id}`);
    } catch (error) {
      console.error(`Error deleting ${endpoint} with id ${id}:`, error);
      throw new ApiError(`Failed to delete ${endpoint} with id ${id}`, (error as any).response?.status || 500, (error as any).response?.data);
    }
  },
});
// Auth service for handling authentication
export const AuthService = {
  getCurrentUser: async (signal?: AbortSignal): Promise<any> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, { signal });
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) return null;
      if ((error as any).response?.status === 401) return null;
      console.error('Error fetching current user:', error);
      throw new ApiError('Failed to fetch current user', (error as any).response?.status || 500, (error as any).response?.data);
    }
  },
  login: async (email: string, password: string): Promise<{ user: any; token: string }> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      return response.data; // Assuming backend returns { user, token }
    } catch (error) {
      console.error('Error logging in:', error);
      throw new ApiError('Failed to login', (error as any).response?.status || 500, (error as any).response?.data);
    }
  },
  logout: async (): Promise<void> => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`);
    } catch (error) {
      console.error('Error logging out:', error);
      // Don't throw for logout errors, just log it.
    }
  },
  signup: async (fullName: string, email: string, password: string): Promise<{ user: any; token: string }> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, { fullName, email, password });
      return response.data; // Assuming backend returns { user, token }
    } catch (error) {
      console.error('Error signing up:', error);
      throw new ApiError('Failed to sign up', (error as any).response?.status || 500, (error as any).response?.data);
    }
  },
};

// Product service for handling product operations
export const ProductService = createCrudService('products');

// Software service for handling software operations
export const SoftwareService = createCrudService('software');

// Blog service for handling blog operations
export const BlogService = createCrudService('blog');

// Career service for handling job and application operations
export const CareerService = createCrudService('careers');

// Order service for handling order operations
export const OrderService = {
  ...createCrudService('orders'),
  updateStatus: async (id: string, status: string): Promise<any> => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating order status with id ${id}:`, error);
      throw new ApiError(`Failed to update order status with id ${id}`, (error as any).response?.status || 500, (error as any).response?.data);
    }
  },
};

// User service for handling user operations
export const UserService = createCrudService('users');

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
