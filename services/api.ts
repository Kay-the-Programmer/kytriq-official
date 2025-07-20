// services/api.ts
const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Custom API Error class for better error handling
 */
export class ApiError extends Error {
    status: number;
    data: any;

    constructor(message: string, status: number, data?: any) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

/**
 * Base API request function that handles authentication, errors, and response parsing
 */
export const apiRequest = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('authToken');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    try {
        const response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });

        if (!response.ok) {
            let errorMessage = `API request failed with status ${response.status}`;
            let errorData = null;

            try {
                errorData = await response.json();
                if (errorData?.message) {
                    errorMessage = errorData.message;
                }
            } catch {
                // If response is not JSON, try to get text
                const errorText = await response.text().catch(() => null);
                if (errorText) errorMessage = errorText;
            }

            throw new ApiError(errorMessage, response.status, errorData);
        }

        if (response.status === 204) return null;
        return response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            console.error(`API request failed: ${url}`, error);
            throw error;
        }

        // For network errors or other non-API errors
        console.error(`API request failed: ${url}`, error);
        throw new ApiError(
            error instanceof Error ? error.message : 'Unknown error occurred',
            0, // 0 indicates a network or client-side error, not a server response
            { originalError: error }
        );
    }
};

// Product-related API services
export const ProductService = {
    getAll: () => apiRequest('/products'),
    getById: (id: string) => apiRequest(`/products/${id}`),
    create: (product: any) => apiRequest('/products', { 
        method: 'POST', 
        body: JSON.stringify(product) 
    }),
    update: (id: string, product: any) => apiRequest(`/products/${id}`, { 
        method: 'PUT', 
        body: JSON.stringify(product) 
    }),
    delete: (id: string) => apiRequest(`/products/${id}`, { method: 'DELETE' }),
};

// Software-related API services
export const SoftwareService = {
    getAll: () => apiRequest('/software'),
    getById: (id: string) => apiRequest(`/software/${id}`),
    create: (software: any) => apiRequest('/software', { 
        method: 'POST', 
        body: JSON.stringify(software) 
    }),
    update: (id: string, software: any) => apiRequest(`/software/${id}`, { 
        method: 'PUT', 
        body: JSON.stringify(software) 
    }),
    delete: (id: string) => apiRequest(`/software/${id}`, { method: 'DELETE' }),
};

// Blog-related API services
export const BlogService = {
    getAll: () => apiRequest('/blog'),
    getById: (id: string) => apiRequest(`/blog/${id}`),
    create: (post: any) => apiRequest('/blog', { 
        method: 'POST', 
        body: JSON.stringify(post) 
    }),
    update: (id: string, post: any) => apiRequest(`/blog/${id}`, { 
        method: 'PUT', 
        body: JSON.stringify(post) 
    }),
    delete: (id: string) => apiRequest(`/blog/${id}`, { method: 'DELETE' }),
};

// Career/Job-related API services
export const CareerService = {
    getAll: () => apiRequest('/careers'),
    getById: (id: string) => apiRequest(`/careers/${id}`),
    create: (job: any) => apiRequest('/careers', { 
        method: 'POST', 
        body: JSON.stringify(job) 
    }),
    update: (id: string, job: any) => apiRequest(`/careers/${id}`, { 
        method: 'PUT', 
        body: JSON.stringify(job) 
    }),
    delete: (id: string) => apiRequest(`/careers/${id}`, { method: 'DELETE' }),
};

// Order-related API services
export const OrderService = {
    getAll: () => apiRequest('/orders'),
    getById: (id: string) => apiRequest(`/orders/${id}`),
    create: (order: any) => apiRequest('/orders', { 
        method: 'POST', 
        body: JSON.stringify(order) 
    }),
    updateStatus: (id: string, status: string) => apiRequest(`/orders/${id}/status`, { 
        method: 'PUT', 
        body: JSON.stringify({ status }) 
    }),
};

// User-related API services
export const UserService = {
    getAll: () => apiRequest('/users'),
    getById: (id: string) => apiRequest(`/users/${id}`),
    create: (user: any) => apiRequest('/users', { 
        method: 'POST', 
        body: JSON.stringify(user) 
    }),
    update: (id: string, user: any) => apiRequest(`/users/${id}`, { 
        method: 'PUT', 
        body: JSON.stringify(user) 
    }),
    delete: (id: string) => apiRequest(`/users/${id}`, { method: 'DELETE' }),
};

// Authentication-related API services
export const AuthService = {
    login: async (email: string, password: string) => {
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        localStorage.setItem('authToken', response.accessToken);
        return response;
    },

    logout: () => {
        localStorage.removeItem('authToken');
    },

    getCurrentUser: async () => {
        try {
            return await apiRequest('/auth/me');
        } catch (error) {
            localStorage.removeItem('authToken');
            return null;
        }
    },

    signup: async (fullName: string, email: string, password: string) => {
        const response = await apiRequest('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ fullName, email, password })
        });
        localStorage.setItem('authToken', response.accessToken);
        return response;
    }
};

// Gemini AI-related API services
export const GeminiService = {
    generateProductDescription: (name: string, category: string) => 
        apiRequest('/gemini/generate-product-description', {
            method: 'POST',
            body: JSON.stringify({ name, category })
        }),

    generateBlogContent: (title: string, tags: string[]) => 
        apiRequest('/gemini/generate-blog-content', {
            method: 'POST',
            body: JSON.stringify({ title, tags })
        }),

    generateJobContent: (title: string, department: string) => 
        apiRequest('/gemini/generate-job-content', {
            method: 'POST',
            body: JSON.stringify({ title, department })
        }),

    generateSoftwareContent: (name: string, category: string) => 
        apiRequest('/gemini/generate-software-content', {
            method: 'POST',
            body: JSON.stringify({ name, category })
        }),
};
