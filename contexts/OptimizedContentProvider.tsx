import React, { createContext, useContext, useMemo, useCallback } from 'react';
import {
  Product,
  SoftwareProduct,
  BlogPost,
  JobOpening,
  JobApplication,
  Order,
  User,
} from './ContentContext'; // Assuming types are exported from here
import useOptimizedContent from '../hooks/use-optimized-content';
import useAuth from '../hooks/use-auth'; // A new hook for authentication logic
import ConfirmDialog from '../components/ConfirmDialog';
import { ApiError } from '../services/api';

interface OptimizedContentContextType {
  products: State<Product>;
  software: State<SoftwareProduct>;
  blog: State<BlogPost>;
  careers: State<JobOpening>;
  applications: State<JobApplication>;
  orders: State<Order>;
  users: State<User>;

  auth: {
    currentUser: User | null;
    isAuthenticating: boolean;
    authError: ApiError | null;
    login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: { message: string; field?: string } }>;
    logout: () => void;
    signup: (fullName: string, email: string, password: string) => Promise<{ success: boolean; user?: User; error?: { message: string; field?: string } }>;
  };

  // Exposing specific actions
  saveProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  // ... other save/delete/update actions
}

const OptimizedContentContext = createContext<OptimizedContentContextType | undefined>(undefined);

export const OptimizedContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAuthenticating, authError, login, logout, signup, isLogoutDialogOpen, handleLogoutConfirm, setIsLogoutDialogOpen } = useAuth();

  const isAdmin = currentUser?.role === 'admin';

  // Fetch data based on user role
  const products = useOptimizedContent('products');
  const software = useOptimizedContent('software');
  const blog = useOptimizedContent('blog');
  const careers = useOptimizedContent('careers');
  const applications = useOptimizedContent('applications', false); // Manual fetch
  const orders = useOptimizedContent('orders', isAdmin); // Only fetch if admin
  const users = useOptimizedContent('users', isAdmin);

  // You might want to fetch user-specific orders differently
  // For example, trigger a fetch inside an effect when currentUser changes

  const getById = useCallback(<T extends {id: string}>(state: State<T>, id: string) => {
    return state.data.find(item => item.id === id);
  }, []);

  const value = useMemo(() => ({
    products,
    software,
    blog,
    careers,
    applications,
    orders,
    users,
    auth: {
      currentUser,
      isAuthenticating,
      authError,
      login,
      logout,
      signup,
    },
    // You can expose getters and actions here, for example:
    getProductById: (id: string) => getById(products, id),
    saveProduct: products.save,
    deleteProduct: products.remove,
    // ... and so on for other types
  }), [
    products, software, blog, careers, applications, orders, users,
    currentUser, isAuthenticating, authError, login, logout, signup, getById
  ]);

  return (
    <OptimizedContentContext.Provider value={value}>
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
    </OptimizedContentContext.Provider>
  );
};

export const useOptimizedContentContext = () => {
  const context = useContext(OptimizedContentContext);
  if (!context) {
    throw new Error('useOptimizedContentContext must be used within an OptimizedContentProvider');
  }
  return context;
};
