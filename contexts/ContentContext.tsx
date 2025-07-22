
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {
  AuthService,
  ApiError,
  ProductService,
  SoftwareService,
  BlogService,
  CareerService,
  OrderService,
  UserService
} from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';

// Interfaces (could be in a separate types file)
export interface Product {
  id: string; name: string; category: 'Smartphones' | 'Laptops' | 'Audio' | 'Accessories' | 'Apparel';
  price: number; originalPrice?: number; imageUrl: string; images: readonly string[]; description: string;
  rating: number; reviewCount: number; tags?: ('Best Seller' | 'Selling Fast' | 'New Arrival')[];
  stockStatus?: 'In Stock' | 'Low Stock' | 'Out of Stock'; colors?: { name: string; class: string }[];
  sizes?: string[]; details?: { description: string; additionalInfo: string[]; reviews: { author: string; rating: number; text: string }[] };
}
export interface SoftwareProduct {
  id: string; name: string; category: 'Business' | 'Creative' | 'Productivity' | 'Developer'; price: number;
  pricingModel: 'Subscription' | 'One-Time'; imageUrl: string; description: string; features: string[]; logoUrl?: string;
}
export interface BlogPost {
  id: string; title: string; author: string; authorAvatarUrl: string; date: string; tags: string[];
  imageUrl: string; excerpt: string; content: string;
}
export interface JobOpening {
  id: string; title: string; department: 'Engineering' | 'Design' | 'Marketing' | 'Product';
  location: 'Remote' | 'San Francisco, CA' | 'New York, NY' | 'Hybrid'; type: 'Full-time' | 'Part-time' | 'Contract';
  description: string; responsibilities: string[]; qualifications: string[];
}
export interface User {
  id: string; fullName: string; email: string; password?: string; role: 'admin' | 'customer'; memberSince: string;
  shippingAddress: { address: string; city: string; state: string; zip: string; };
}
export interface Order {
  id:string; date: string; customerName: string; status: 'Delivered' | 'Processing' | 'Shipped' | 'Cancelled';
  items: (Product & { quantity: number })[]; total: number; userId: string;
}


interface ContentContextType {
  products: Product[]; softwareProducts: SoftwareProduct[]; blogPosts: BlogPost[];
  jobOpenings: JobOpening[]; orders: Order[]; users: User[];
  loading: boolean;
  error: Error | null;
  getProductById: (id: string) => Product | undefined;
  getSoftwareById: (id: string) => SoftwareProduct | undefined;
  getBlogPostById: (id: string) => BlogPost | undefined;
  getJobById: (id: string) => JobOpening | undefined;
  getOrderById: (id: string) => Order | undefined;
  getUserById: (id: string) => User | undefined;
  saveProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  saveSoftwareProduct: (software: SoftwareProduct) => Promise<void>;
  deleteSoftwareProduct: (softwareId: string) => Promise<void>;
  saveBlogPost: (post: BlogPost) => Promise<void>;
  deleteBlogPost: (postId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, newStatus: Order['status']) => Promise<void>;
  saveJobOpening: (job: JobOpening) => Promise<void>;
  deleteJobOpening: (jobId: string) => Promise<void>;
  saveUser: (user: User) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  clearError: () => void;
  currentUser: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: { message: string; field?: string } }>;
  logout: () => void;
  signup: (fullName: string, email: string, password: string) => Promise<{ success: boolean; user?: User; error?: { message: string; field?: string } }>;
  placeOrder: (items: (Product & {quantity: number})[], user: User) => Promise<string | null>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [softwareProducts, setSoftwareProducts] = useState<SoftwareProduct[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const clearError = () => setError(null);

  useEffect(() => {
    // Create an AbortController for this effect instance
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            let ordersData = [];
            let usersData = [];

            // Public data
            const [productsData, softwareData, blogData, careersData] = await Promise.all([
                ProductService.getAll({}, signal),
                SoftwareService.getAll({}, signal),
                BlogService.getAll({}, signal),
                CareerService.getAll({}, signal),
            ]);

            // Check if the request was aborted before updating state
            if (signal.aborted) return;

            setProducts(productsData);
            setSoftwareProducts(softwareData);
            setBlogPosts(blogData);
            setJobOpenings(careersData);

            if (token) {
                const userData = await AuthService.getCurrentUser(signal);

                // Check if the request was aborted before updating state
                if (signal.aborted) return;

                setCurrentUser(userData);

                // Fetch admin/protected data if user is admin
                if (userData?.role === 'admin') {
                    [ordersData, usersData] = await Promise.all([
                        OrderService.getAll({}, signal),
                        UserService.getAll({}, signal),
                    ]);
                } else { // Fetch only user's own orders if they are a customer
                    // Assuming an endpoint /api/orders/my-orders exists for logged-in users
                    // For now, we filter on the client, but a dedicated endpoint is better.
                    const allOrders = await OrderService.getAll({}, signal);
                    ordersData = allOrders.filter((o: Order) => o.userId === userData.id);
                }
            }

            // Check if the request was aborted before updating state
            if (signal.aborted) return;

            setOrders(ordersData);
            setUsers(usersData);

        } catch (error) {
            // Don't update state or show errors if the request was aborted
            if (signal.aborted) return;

            console.error("Failed to fetch initial data", error);
            // If token is invalid, log out user
            if (error instanceof Error) {
                setError(error);
                if (error.message.includes('401') || error.message.includes('403')) {
                    logout();
                }
            } else {
                setError(new Error('Failed to fetch initial data'));
            }
        } finally {
            // Don't update loading state if the request was aborted
            if (!signal.aborted) {
                setLoading(false);
            }
        }
    };

    fetchAllData().catch(error => {
        // Don't update state or show errors if the request was aborted
        if (signal.aborted) return;

        console.error('Error fetching initial data:', error);
        if (error instanceof Error) {
            setError(error);
        } else {
            setError(new Error('Failed to fetch initial data'));
        }
        setLoading(false);
    });

    // Cleanup function to abort any pending requests when the component unmounts
    // or when the dependencies change
    return () => {
        abortController.abort();
    };
  }, [currentUser?.id]); // Refetch when user logs in/out

  const getProductById = (id: string) => products.find((p: { id: string; }) => p.id === id);
  const getSoftwareById = (id: string) => softwareProducts.find((s: { id: string; }) => s.id === id);
  const getBlogPostById = (id: string) => blogPosts.find((b: { id: string; }) => b.id === id);
  const getJobById = (id: string) => jobOpenings.find((j: { id: string; }) => j.id === id);
  const getOrderById = (id: string) => orders.find((o: { id: string; }) => o.id === id);
  const getUserById = (id: string) => users.find((u: { id: string; }) => u.id === id);

  const saveProduct = async (product: Product) => {
    try {
      // If product.id is undefined or empty, it's a new product
      const isNew = !product.id || !getProductById(product.id);
      const savedProduct = isNew 
        ? await ProductService.create(product)
        : await ProductService.update(product.id, product);

      // Check if savedProduct is null or undefined before accessing its properties
      if (!savedProduct) {
        console.error('Failed to save product: API returned null or undefined');
        setError(new Error('Failed to save product: API returned null or undefined'));
        return;
      }

      setProducts((prev: any[]) => isNew ? [savedProduct, ...prev] : prev.map(p => p && p.id === savedProduct.id ? savedProduct : p));
    } catch (error) {
      console.error('Failed to save product:', error);
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error('Failed to save product'));
      }
    }
  };
  const deleteProduct = async (productId: string) => {
    try {
      await ProductService.delete(productId);
      setProducts((prev: any[]) => prev.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Failed to delete product:', error);
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error('Failed to delete product'));
      }
    }
  };

  const saveSoftwareProduct = async (software: SoftwareProduct) => {
    try {
      // If software.id is undefined or empty, it's a new software product
      const isNew = !software.id || !getSoftwareById(software.id);
      const savedSoftware = isNew 
        ? await SoftwareService.create(software)
        : await SoftwareService.update(software.id, software);

      // Check if savedSoftware is null or undefined before accessing its properties
      if (!savedSoftware) {
        console.error('Failed to save software product: API returned null or undefined');
        setError(new Error('Failed to save software product: API returned null or undefined'));
        return;
      }

      setSoftwareProducts((prev: any[]) => isNew ? [savedSoftware, ...prev] : prev.map(p => p && p.id === savedSoftware.id ? savedSoftware : p));
    } catch (error) {
      console.error('Failed to save software product:', error);
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error('Failed to save software product'));
      }
    }
  };

  const deleteSoftwareProduct = async (softwareId: string) => {
    try {
      await SoftwareService.delete(softwareId);
      setSoftwareProducts((prev: any[]) => prev.filter(p => p.id !== softwareId));
    } catch (error) {
      console.error('Failed to delete software product:', error);
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error('Failed to delete software product'));
      }
    }
  };

  const saveBlogPost = async (post: BlogPost) => {
    try {
      // If post.id is undefined or empty, it's a new blog post
      const isNew = !post.id || !getBlogPostById(post.id);
      const savedPost = isNew 
        ? await BlogService.create(post)
        : await BlogService.update(post.id, post);

      // Check if savedPost is null or undefined before accessing its properties
      if (!savedPost) {
        console.error('Failed to save blog post: API returned null or undefined');
        setError(new Error('Failed to save blog post: API returned null or undefined'));
        return;
      }

      setBlogPosts((prev: any[]) => isNew ? [savedPost, ...prev] : prev.map(p => p && p.id === savedPost.id ? savedPost : p));
    } catch (error) {
      console.error('Failed to save blog post:', error);
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error('Failed to save blog post'));
      }
    }
  };
  const deleteBlogPost = async (postId: string) => {
    try {
      await BlogService.delete(postId);
      setBlogPosts((prev: any[]) => prev.filter(p => p.id !== postId));
    } catch (error) {
      console.error('Failed to delete blog post:', error);
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error('Failed to delete blog post'));
      }
    }
  };
   const saveJobOpening = async (job: JobOpening) => {
    try {
      // If job.id is undefined or empty, it's a new job opening
      const isNew = !job.id || !getJobById(job.id);
      const savedJob = isNew 
        ? await CareerService.create(job)
        : await CareerService.update(job.id, job);

      // Check if savedJob is null or undefined before accessing its properties
      if (!savedJob) {
        console.error('Failed to save job opening: API returned null or undefined');
        setError(new Error('Failed to save job opening: API returned null or undefined'));
        return;
      }

      setJobOpenings((prev: any[]) => isNew ? [savedJob, ...prev] : prev.map(j => j && j.id === savedJob.id ? savedJob : j));
    } catch (error) {
      console.error('Failed to save job opening:', error);
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error('Failed to save job opening'));
      }
    }
  };
  const deleteJobOpening = async (jobId: string) => {
    try {
      await CareerService.delete(jobId);
      setJobOpenings((prev: any[]) => prev.filter(j => j.id !== jobId));
    } catch (error) {
      console.error('Failed to delete job opening:', error);
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error('Failed to delete job opening'));
      }
    }
  };
   const saveUser = async (user: User) => {
    try {
      // If user.id is undefined or empty, it's a new user
      const isNew = !user.id || !getUserById(user.id);
      const savedUser = isNew 
        ? await UserService.create(user)
        : await UserService.update(user.id, user);

      // Check if savedUser is null or undefined before accessing its properties
      if (!savedUser) {
        console.error('Failed to save user: API returned null or undefined');
        setError(new Error('Failed to save user: API returned null or undefined'));
        return;
      }

      setUsers((prev: any[]) => isNew ? [savedUser, ...prev] : prev.map(u => u && u.id === savedUser.id ? savedUser : u));
      if (currentUser?.id === savedUser.id) setCurrentUser(savedUser);
    } catch (error) {
      console.error('Failed to save user:', error);
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error('Failed to save user'));
      }
    }
  };
  const deleteUser = async (userId: string) => {
    try {
      await UserService.delete(userId);
      setUsers((prev: any[]) => prev.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Failed to delete user:', error);
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error('Failed to delete user'));
      }
    }
  };
  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const updatedOrder = await OrderService.updateStatus(orderId, newStatus);

      // Check if updatedOrder is null or undefined before using it
      if (!updatedOrder) {
        console.error('Failed to update order status: API returned null or undefined');
        setError(new Error('Failed to update order status: API returned null or undefined'));
        return;
      }

      setOrders((prev: any[]) => prev.map(o => o && o.id === orderId ? updatedOrder : o));
    } catch (error) {
      console.error('Failed to update order status:', error);
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error('Failed to update order status'));
      }
    }
  };

  const placeOrder = async (items: (Product & {quantity: number})[], user: User): Promise<string | null> => {
    try {
        const newOrder = await OrderService.create({ userId: user.id, items });

        // Check if newOrder is null or undefined before accessing its properties
        if (!newOrder) {
          console.error('Failed to place order: API returned null or undefined');
          setError(new Error('Failed to place order: API returned null or undefined'));
          return null;
        }

        setOrders((prev: any) => [newOrder, ...prev]);
        return newOrder.id;
    } catch(error) {
      console.error("Failed to place order:", error);
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error('Failed to place order'));
      }
      return null;
    }
  };


  const login = async (email: string, password: string): Promise<{ success: boolean; error?: { message: string; field?: string } }> => {
    try {
        const response = await AuthService.login(email, password);

        // Check if response is null or undefined before accessing its properties
        if (!response) {
          console.error('Failed to login: API returned null or undefined');
          setError(new Error('Failed to login: API returned null or undefined'));
          return { success: false, error: { message: 'Login failed: API returned null or undefined' } };
        }

        const { user } = response;
        setCurrentUser(user);
        return { success: true, user };
    } catch (error) {
        console.error('Login failed:', error);

        // Set the error in the context
        if (error instanceof Error) {
            setError(error);
        } else {
            setError(new Error('Login failed'));
        }

        // Return detailed error information
        if (error instanceof ApiError && error.data) {
            return { 
                success: false, 
                error: { 
                    message: error.message || 'Login failed',
                    field: error.data.field 
                } 
            };
        }

        return { 
            success: false, 
            error: { 
                message: error instanceof Error ? error.message : 'Login failed' 
            } 
        };
    }
  };

  const handleLogoutConfirm = () => {
    AuthService.logout();
    setCurrentUser(null);
    setIsLogoutDialogOpen(false);
  };

  const logout = () => {
    // Show the logout confirmation dialog
    setIsLogoutDialogOpen(true);
  };

  const signup = async (fullName: string, email: string, password: string): Promise<{ success: boolean; user?: User; error?: { message: string; field?: string } }> => {
    try {
        const response = await AuthService.signup(fullName, email, password);

        // Check if response is null or undefined before accessing its properties
        if (!response) {
          console.error('Failed to signup: API returned null or undefined');
          setError(new Error('Failed to signup: API returned null or undefined'));
          return { success: false, error: { message: 'Signup failed: API returned null or undefined' } };
        }

        const { user } = response;
        setCurrentUser(user);
        setUsers((prev: any) => [user, ...prev]);
        return { success: true, user };
    } catch (error) {
        console.error('Signup failed:', error);

        // Set the error in the context
        if (error instanceof Error) {
            setError(error);
        } else {
            setError(new Error('Signup failed'));
        }

        // Return detailed error information
        if (error instanceof ApiError && error.data) {
            return { 
                success: false, 
                error: { 
                    message: error.message || 'Signup failed',
                    field: error.data.field 
                } 
            };
        }

        return { 
            success: false, 
            error: { 
                message: error instanceof Error ? error.message : 'Signup failed' 
            } 
        };
    }
  };


  return (
    <ContentContext.Provider value={{ 
        products, softwareProducts, blogPosts, jobOpenings, orders, users, loading, error, clearError,
        getProductById, getSoftwareById, getBlogPostById, getJobById, getOrderById, getUserById,
        saveProduct, deleteProduct, saveSoftwareProduct, deleteSoftwareProduct, saveBlogPost, deleteBlogPost, updateOrderStatus,
        saveJobOpening, deleteJobOpening, saveUser, deleteUser,
        currentUser, login, logout, signup, placeOrder
    }}>
      {children}
      <ConfirmDialog
        isOpen={isLogoutDialogOpen}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmText="Log Out"
        cancelText="Cancel"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setIsLogoutDialogOpen(false)}
      />
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
