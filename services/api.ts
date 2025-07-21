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
 * @param url The API endpoint URL
 * @param options Request options
 * @param abortSignal Optional AbortSignal to cancel the request
 */
export const apiRequest = async (url: string, options: RequestInit = {}, abortSignal?: AbortSignal) => {
    const token = localStorage.getItem('authToken');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    try {
        const response = await fetch(`${API_BASE_URL}${url}`, { 
            ...options, 
            headers,
            signal: abortSignal 
        });

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
        // Don't throw error if request was aborted
        if (error instanceof DOMException && error.name === 'AbortError') {
            console.log(`Request to ${url} was aborted`);
            return null;
        }

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
    getAll: (options = {}, signal?: AbortSignal) => apiRequest('/products', options, signal),
    getById: (id: string, options = {}, signal?: AbortSignal) => apiRequest(`/products/${id}`, options, signal),
    create: (product: any, options = {}, signal?: AbortSignal) => apiRequest('/products', { 
        ...options,
        method: 'POST', 
        body: JSON.stringify(product) 
    }, signal),
    update: (id: string, product: any, options = {}, signal?: AbortSignal) => apiRequest(`/products/${id}`, { 
        ...options,
        method: 'PUT', 
        body: JSON.stringify(product) 
    }, signal),
    delete: (id: string, options = {}, signal?: AbortSignal) => apiRequest(`/products/${id}`, { ...options, method: 'DELETE' }, signal),
};

// Software-related API services
export const SoftwareService = {
    getAll: (options = {}, signal?: AbortSignal) => apiRequest('/software', options, signal),
    getById: (id: string, options = {}, signal?: AbortSignal) => apiRequest(`/software/${id}`, options, signal),
    create: (software: any, options = {}, signal?: AbortSignal) => apiRequest('/software', { 
        ...options,
        method: 'POST', 
        body: JSON.stringify(software) 
    }, signal),
    update: (id: string, software: any, options = {}, signal?: AbortSignal) => apiRequest(`/software/${id}`, { 
        ...options,
        method: 'PUT', 
        body: JSON.stringify(software) 
    }, signal),
    delete: (id: string, options = {}, signal?: AbortSignal) => apiRequest(`/software/${id}`, { ...options, method: 'DELETE' }, signal),
};

// Blog-related API services
export const BlogService = {
    getAll: (options = {}, signal?: AbortSignal) => apiRequest('/blog', options, signal),
    getById: (id: string, options = {}, signal?: AbortSignal) => apiRequest(`/blog/${id}`, options, signal),
    create: (post: any, options = {}, signal?: AbortSignal) => apiRequest('/blog', { 
        ...options,
        method: 'POST', 
        body: JSON.stringify(post) 
    }, signal),
    update: (id: string, post: any, options = {}, signal?: AbortSignal) => apiRequest(`/blog/${id}`, { 
        ...options,
        method: 'PUT', 
        body: JSON.stringify(post) 
    }, signal),
    delete: (id: string, options = {}, signal?: AbortSignal) => apiRequest(`/blog/${id}`, { ...options, method: 'DELETE' }, signal),
};

// Career/Job-related API services
export const CareerService = {
    getAll: (options = {}, signal?: AbortSignal) => apiRequest('/careers', options, signal),
    getById: (id: string, options = {}, signal?: AbortSignal) => apiRequest(`/careers/${id}`, options, signal),
    create: (job: any, options = {}, signal?: AbortSignal) => apiRequest('/careers', { 
        ...options,
        method: 'POST', 
        body: JSON.stringify(job) 
    }, signal),
    update: (id: string, job: any, options = {}, signal?: AbortSignal) => apiRequest(`/careers/${id}`, { 
        ...options,
        method: 'PUT', 
        body: JSON.stringify(job) 
    }, signal),
    delete: (id: string, options = {}, signal?: AbortSignal) => apiRequest(`/careers/${id}`, { ...options, method: 'DELETE' }, signal),
};

// Order-related API services
export const OrderService = {
    getAll: (options = {}, signal?: AbortSignal) => apiRequest('/orders', options, signal),
    getById: (id: string, options = {}, signal?: AbortSignal) => apiRequest(`/orders/${id}`, options, signal),
    create: (order: any, options = {}, signal?: AbortSignal) => apiRequest('/orders', { 
        ...options,
        method: 'POST', 
        body: JSON.stringify(order) 
    }, signal),
    updateStatus: (id: string, status: string, options = {}, signal?: AbortSignal) => apiRequest(`/orders/${id}/status`, { 
        ...options,
        method: 'PUT', 
        body: JSON.stringify({ status }) 
    }, signal),
};

// User-related API services
export const UserService = {
    getAll: (options = {}, signal?: AbortSignal) => apiRequest('/users', options, signal),
    getById: (id: string, options = {}, signal?: AbortSignal) => apiRequest(`/users/${id}`, options, signal),
    create: (user: any, options = {}, signal?: AbortSignal) => apiRequest('/users', { 
        ...options,
        method: 'POST', 
        body: JSON.stringify(user) 
    }, signal),
    update: (id: string, user: any, options = {}, signal?: AbortSignal) => apiRequest(`/users/${id}`, { 
        ...options,
        method: 'PUT', 
        body: JSON.stringify(user) 
    }, signal),
    delete: (id: string, options = {}, signal?: AbortSignal) => apiRequest(`/users/${id}`, { ...options, method: 'DELETE' }, signal),
};

// Authentication-related API services
export const AuthService = {
    login: async (email: string, password: string, options = {}, signal?: AbortSignal) => {
        const response = await apiRequest('/auth/login', {
            ...options,
            method: 'POST',
            body: JSON.stringify({ email, password })
        }, signal);
        if (response && response.accessToken) {
            localStorage.setItem('authToken', response.accessToken);
        }
        return response;
    },

    logout: () => {
        localStorage.removeItem('authToken');
    },

    getCurrentUser: async (signal?: AbortSignal, options = {}) => {
        try {
            return await apiRequest('/auth/me', options, signal);
        } catch (error) {
            // Don't remove token if request was aborted
            if (!(error instanceof DOMException && error.name === 'AbortError')) {
                localStorage.removeItem('authToken');
            }
            return null;
        }
    },

    signup: async (fullName: string, email: string, password: string, options = {}, signal?: AbortSignal) => {
        const response = await apiRequest('/auth/signup', {
            ...options,
            method: 'POST',
            body: JSON.stringify({ fullName, email, password })
        }, signal);
        if (response && response.accessToken) {
            localStorage.setItem('authToken', response.accessToken);
        }
        return response;
    }
};

// Gemini AI-related API services
export const GeminiService = {
    generateProductDescription: (name: string, category: string, options = {}, signal?: AbortSignal) => 
        apiRequest('/gemini/generate-product-description', {
            ...options,
            method: 'POST',
            body: JSON.stringify({ name, category })
        }, signal),

    generateBlogContent: (title: string, tags: string[], options = {}, signal?: AbortSignal) => 
        apiRequest('/gemini/generate-blog-content', {
            ...options,
            method: 'POST',
            body: JSON.stringify({ title, tags })
        }, signal),

    generateJobContent: (title: string, department: string, options = {}, signal?: AbortSignal) => 
        apiRequest('/gemini/generate-job-content', {
            ...options,
            method: 'POST',
            body: JSON.stringify({ title, department })
        }, signal),

    generateSoftwareContent: (name: string, category: string, options = {}, signal?: AbortSignal) => 
        apiRequest('/gemini/generate-software-content', {
            ...options,
            method: 'POST',
            body: JSON.stringify({ name, category })
        }, signal),
};
