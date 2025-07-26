import React, { createContext, useContext, ReactNode } from 'react';
import { ProductProvider, useProductContext, Product } from './ProductContext';
import { SoftwareProvider, useSoftwareContext, SoftwareProduct } from './SoftwareContext';
import { BlogProvider, useBlogContext } from './BlogContext';
import type { BlogPost } from './BlogContext';
import { CareerProvider, useCareerContext, JobOpening, JobApplication } from './CareerContext';
import { OrderProvider, useOrderContext, Order } from './OrderContext';
import { UserProvider, useUserContext } from './UserContext';
import { AuthProvider, useAuthContext, User } from './AuthContext';

// Combined context interface that includes all the individual contexts
interface ContentContextType {
  // Product context
  products: Product[];
  getProductById: (id: string) => Product | undefined;
  saveProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;

  // Software context
  softwareProducts: SoftwareProduct[];
  getSoftwareById: (id: string) => SoftwareProduct | undefined;
  saveSoftwareProduct: (software: SoftwareProduct) => Promise<void>;
  deleteSoftwareProduct: (softwareId: string) => Promise<void>;

  // Blog context
  blogPosts: BlogPost[];
  getBlogPostById: (id: string) => BlogPost | undefined;
  saveBlogPost: (post: BlogPost) => Promise<void>;
  deleteBlogPost: (postId: string) => Promise<void>;

  // Career context
  jobOpenings: JobOpening[];
  jobApplications: JobApplication[];
  getJobById: (id: string) => JobOpening | undefined;
  getJobApplicationById: (id: string) => JobApplication | undefined;
  getJobApplicationsByJobId: (jobId: string) => JobApplication[];
  saveJobOpening: (job: JobOpening) => Promise<void>;
  deleteJobOpening: (jobId: string) => Promise<void>;
  saveJobApplication: (application: JobApplication) => Promise<void>;
  updateJobApplicationStatus: (applicationId: string, status: 'pending' | 'reviewed' | 'accepted' | 'rejected') => Promise<void>;
  deleteJobApplication: (applicationId: string) => Promise<void>;

  // Order context
  orders: Order[];
  getOrderById: (id: string) => Order | undefined;
  updateOrderStatus: (orderId: string, newStatus: Order['status']) => Promise<void>;
  placeOrder: (items: (Product & {quantity: number})[], user: User) => Promise<string | null>;

  // User context
  users: User[];
  getUserById: (id: string) => User | undefined;
  saveUser: (user: User) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;

  // Auth context
  currentUser: User | null;
  login: (email: string, password: string) => Promise<{ 
    success: boolean; 
    user?: User; 
    error?: { message: string; field?: string } 
  }>;
  logout: () => void;
  signup: (fullName: string, email: string, password: string) => Promise<{ 
    success: boolean; 
    user?: User; 
    error?: { message: string; field?: string } 
  }>;

  // Common
  loading: boolean;
  error: Error | null;
  clearError: () => void;
}

// Create the combined context
const ContentContext = createContext<ContentContextType | undefined>(undefined);

// AuthConsumer component to access auth context
const AuthConsumer: React.FC<{ children: (auth: ReturnType<typeof useAuthContext>) => ReactNode }> = ({ children }) => {
  const auth = useAuthContext();
  return <>{children(auth)}</>;
};

// ContentProvider component that combines all the individual providers
export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Create a component that combines all the hooks and provides the combined context
  const ContentConsumer: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Get values from all the individual contexts
    const product = useProductContext();
    const software = useSoftwareContext();
    const blog = useBlogContext();
    const career = useCareerContext();
    const auth = useAuthContext();
    const order = useOrderContext();
    const user = useUserContext();

    // Combine loading and error states
    const loading = product.loading || software.loading || blog.loading || 
                   career.loading || auth.loading || order.loading || user.loading;

    const error = product.error || software.error || blog.error || 
                 career.error || auth.error || order.error || user.error;

    // Clear all errors
    const clearError = () => {
      product.clearError();
      software.clearError();
      blog.clearError();
      career.clearError();
      auth.clearError();
      order.clearError();
      user.clearError();
    };

    // Combine all context values
    const value: ContentContextType = {
      // Product context
      products: product.products,
      getProductById: product.getProductById,
      saveProduct: product.saveProduct,
      deleteProduct: product.deleteProduct,

      // Software context
      softwareProducts: software.softwareProducts,
      getSoftwareById: software.getSoftwareById,
      saveSoftwareProduct: software.saveSoftwareProduct,
      deleteSoftwareProduct: software.deleteSoftwareProduct,

      // Blog context
      blogPosts: blog.blogPosts,
      getBlogPostById: blog.getBlogPostById,
      saveBlogPost: blog.saveBlogPost,
      deleteBlogPost: blog.deleteBlogPost,

      // Career context
      jobOpenings: career.jobOpenings,
      jobApplications: career.jobApplications,
      getJobById: career.getJobById,
      getJobApplicationById: career.getJobApplicationById,
      getJobApplicationsByJobId: career.getJobApplicationsByJobId,
      saveJobOpening: career.saveJobOpening,
      deleteJobOpening: career.deleteJobOpening,
      saveJobApplication: career.saveJobApplication,
      updateJobApplicationStatus: career.updateJobApplicationStatus,
      deleteJobApplication: career.deleteJobApplication,

      // Order context
      orders: order.orders,
      getOrderById: order.getOrderById,
      updateOrderStatus: order.updateOrderStatus,
      placeOrder: order.placeOrder,

      // User context
      users: user.users,
      getUserById: user.getUserById,
      saveUser: user.saveUser,
      deleteUser: user.deleteUser,

      // Auth context
      currentUser: auth.currentUser,
      login: auth.login,
      logout: auth.logout,
      signup: auth.signup,

      // Common
      loading,
      error,
      clearError
    };

    return (
      <ContentContext.Provider value={value}>
        {children}
      </ContentContext.Provider>
    );
  };

  // Nest all the providers
  return (
    <AuthProvider>
      <AuthConsumer>
        {(auth) => (
          <UserProvider currentUser={auth.currentUser} setCurrentUser={(user) => {
            // This is a workaround since we can't directly access setCurrentUser from AuthContext
            if (user === null) {
              auth.logout();
            }
          }}>
            <ProductProvider>
              <SoftwareProvider>
                <BlogProvider>
                  <CareerProvider>
                    <OrderProvider currentUser={auth.currentUser}>
                      <ContentConsumer>
                        {children}
                      </ContentConsumer>
                    </OrderProvider>
                  </CareerProvider>
                </BlogProvider>
              </SoftwareProvider>
            </ProductProvider>
          </UserProvider>
        )}
      </AuthConsumer>
    </AuthProvider>
  );
};

// Hook to use the content context (for backward compatibility)
export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
