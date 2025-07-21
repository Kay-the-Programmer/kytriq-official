import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import CallToAction from './components/CallToAction';
import BusinessSection from './components/BusinessSection';
import ExploreSection from './components/ExploreSection';
import Footer from './components/Footer';
import ProductsPage from './pages/ProductsPage';
import SoftwarePage from './pages/SoftwarePage';
import SoftwareDetailPage from './pages/SoftwareDetailPage';
import Cart from './components/Cart';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import { useCart } from './contexts/CartContext';
import Snackbar from './components/Snackbar';
import AccountPage from './pages/AccountPage';
import SoftwareGetStartedPage from './pages/SoftwareGetStartedPage';
import SoftwareSetupConfirmationPage from './pages/SoftwareSetupConfirmationPage';
import ProductDetailPage from './pages/ProductDetailPage';
import { useContent } from './contexts/ContentContext';
import AdminPage from './pages/AdminPage';
import AdminProductForm from './pages/AdminProductForm';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import AdminBlogForm from './pages/AdminBlogForm';
import SoftwareDevelopmentPage from './pages/SoftwareDevelopmentPage';
import ElectronicsPage from './pages/ElectronicsPage';
import PosSystemsPage from './pages/PosSystemsPage';
import ECommercePage from './pages/ECommercePage';
import AboutPage from './pages/AboutPage';
import CareersPage from './pages/CareersPage';
import CareerApplicationPage from './pages/CareerApplicationPage';
import CareerApplicationConfirmationPage from './pages/CareerApplicationConfirmationPage';
import ContactPage from './pages/ContactPage';
import ContactConfirmationPage from './pages/ContactConfirmationPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import OrderDetailPage from './pages/OrderDetailPage';
import AdminCareerForm from './pages/AdminCareerForm';
import AdminUserForm from './pages/AdminUserForm';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Icon from './components/Icon';
import AdminSoftwareForm from './pages/AdminSoftwareForm';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const handleNavigate = (page: string, id?: string) => {
        if (id) {
            navigate(`/${page}/${id}`);
        } else {
            navigate(`/${page}`);
        }
    };

    return (
        <>
            <Hero onNavigate={handleNavigate} />
            <div className="bg-brand-gray-50 py-16 sm:py-24">
                <Features onNavigate={handleNavigate} />
            </div>
            <CallToAction onNavigate={handleNavigate} />
            <BusinessSection />
            <ExploreSection onNavigate={handleNavigate} />
        </>
    );
};

// Wrapper components for pages that need parameters
const ProductDetailWrapper: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { getProductById } = useContent();
    const navigate = useNavigate();
    const product = getProductById(id!);

    if (!product) {
        return <Navigate to="/products" />;
    }

    const handleNavigate = (page: string, id?: string) => {
        if (id) {
            navigate(`/${page}/${id}`);
        } else {
            navigate(`/${page}`);
        }
    };

    return <ProductDetailPage product={product} onNavigate={handleNavigate} />;
};

const SoftwareDetailWrapper: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { getSoftwareById } = useContent();
    const navigate = useNavigate();
    const software = getSoftwareById(id!);

    if (!software) {
        return <Navigate to="/software" />;
    }

    const handleNavigate = (page: string, id?: string) => {
        if (id) {
            navigate(`/${page}/${id}`);
        } else {
            navigate(`/${page}`);
        }
    };

    return <SoftwareDetailPage software={software} onNavigate={handleNavigate} />;
};

const BlogDetailWrapper: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { getBlogPostById } = useContent();
    const navigate = useNavigate();
    const post = getBlogPostById(id!);

    if (!post) {
        return <Navigate to="/blog" />;
    }

    const handleNavigate = (page: string, id?: string) => {
        if (id) {
            navigate(`/${page}/${id}`);
        } else {
            navigate(`/${page}`);
        }
    };

    return <BlogDetailPage post={post} onNavigate={handleNavigate} />;
};

const OrderDetailWrapper: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { getOrderById } = useContent();
    const navigate = useNavigate();
    const order = getOrderById(id!);

    if (!order) {
        return <Navigate to="/account" />;
    }

    const handleNavigate = (page: string, id?: string) => {
        if (id) {
            navigate(`/${page}/${id}`);
        } else {
            navigate(`/${page}`);
        }
    };

    return <OrderDetailPage order={order} onNavigate={handleNavigate} />;
};

// Protected route component
const ProtectedRoute: React.FC<{
    element: React.ReactNode | ((navigate: any) => React.ReactNode);
    adminOnly?: boolean;
}> = ({ element, adminOnly = false }) => {
    const { currentUser } = useContent();
    const navigate = useNavigate();

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && currentUser.role !== 'admin') {
        return <Navigate to="/" />;
    }

    return <>{typeof element === 'function' ? element(navigate) : element}</>;
};


// Wrapper for SoftwareGetStarted page
const SoftwareGetStartedWrapper: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { getSoftwareById } = useContent();
    const navigate = useNavigate();
    const software = getSoftwareById(id!);

    if (!software) {
        return <Navigate to="/software" />;
    }

    const handleNavigate = (page: string, id?: string) => {
        if (id) {
            navigate(`/${page}/${id}`);
        } else {
            navigate(`/${page}`);
        }
    };

    const handleCompleteSetup = (softwareId: string) => {
        navigate(`/software-setup-confirmation/${softwareId}`);
    };

    return <SoftwareGetStartedPage 
        software={software} 
        onNavigate={handleNavigate} 
        onCompleteSetup={handleCompleteSetup} 
    />;
};

// Wrapper for SoftwareSetupConfirmation page
const SoftwareSetupConfirmationWrapper: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { getSoftwareById } = useContent();
    const navigate = useNavigate();
    const software = getSoftwareById(id!);

    if (!software) {
        return <Navigate to="/software" />;
    }

    const handleNavigate = (page: string, id?: string) => {
        if (id) {
            navigate(`/${page}/${id}`);
        } else {
            navigate(`/${page}`);
        }
    };

    return <SoftwareSetupConfirmationPage software={software} onNavigate={handleNavigate} />;
};

// Wrapper for CareerApplication page
const CareerApplicationWrapper: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { getJobById } = useContent();
    const navigate = useNavigate();
    const job = getJobById(id!);

    if (!job) {
        return <Navigate to="/careers" />;
    }

    const handleNavigate = (page: string, id?: string) => {
        if (id) {
            navigate(`/${page}/${id}`);
        } else {
            navigate(`/${page}`);
        }
    };

    const handleCompleteApplication = (jobId: string) => {
        navigate(`/career-application-confirmation/${jobId}`);
    };

    return <CareerApplicationPage 
        job={job} 
        onNavigate={handleNavigate} 
        onCompleteApplication={handleCompleteApplication} 
    />;
};

// Wrapper for CareerApplicationConfirmation page
const CareerApplicationConfirmationWrapper: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { getJobById } = useContent();
    const navigate = useNavigate();
    const job = getJobById(id!);

    if (!job) {
        return <Navigate to="/careers" />;
    }

    const handleNavigate = (page: string, id?: string) => {
        if (id) {
            navigate(`/${page}/${id}`);
        } else {
            navigate(`/${page}`);
        }
    };

    return <CareerApplicationConfirmationPage job={job} onNavigate={handleNavigate} />;
};

// Wrapper for AdminProductForm page
const AdminProductFormWrapper: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const { getProductById } = useContent();
    const navigate = useNavigate();
    const product = id ? getProductById(id) : null;

    const handleNavigate = (page: string, id?: string) => {
        if (id) {
            navigate(`/${page}/${id}`);
        } else {
            navigate(`/${page}`);
        }
    };

    return <AdminProductForm product={product} onNavigate={handleNavigate} />;
};

// Wrapper for AdminSoftwareForm page
const AdminSoftwareFormWrapper: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const { getSoftwareById } = useContent();
    const navigate = useNavigate();
    const software = id ? getSoftwareById(id) : null;

    const handleNavigate = (page: string, id?: string) => {
        if (id) {
            navigate(`/${page}/${id}`);
        } else {
            navigate(`/${page}`);
        }
    };

    return <AdminSoftwareForm software={software} onNavigate={handleNavigate} />;
};

// Wrapper for AdminBlogForm page
const AdminBlogFormWrapper: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const { getBlogPostById } = useContent();
    const navigate = useNavigate();
    const post = id ? getBlogPostById(id) : null;

    const handleNavigate = (page: string, id?: string) => {
        if (id) {
            navigate(`/${page}/${id}`);
        } else {
            navigate(`/${page}`);
        }
    };

    return <AdminBlogForm post={post} onNavigate={handleNavigate} />;
};

// Wrapper for AdminCareerForm page
const AdminCareerFormWrapper: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const { getJobById } = useContent();
    const navigate = useNavigate();
    const job = id ? getJobById(id) : null;

    const handleNavigate = (page: string, id?: string) => {
        if (id) {
            navigate(`/${page}/${id}`);
        } else {
            navigate(`/${page}`);
        }
    };

    return <AdminCareerForm job={job} onNavigate={handleNavigate} />;
};

// Wrapper for AdminUserForm page
const AdminUserFormWrapper: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const { getUserById } = useContent();
    const navigate = useNavigate();
    const user = id ? getUserById(id) : null;

    const handleNavigate = (page: string, id?: string) => {
        if (id) {
            navigate(`/${page}/${id}`);
        } else {
            navigate(`/${page}`);
        }
    };

    return <AdminUserForm user={user} onNavigate={handleNavigate} />;
};

// Wrapper for OrderConfirmation page
const OrderConfirmationWrapper: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const handleNavigate = (page: string, id?: string) => {
        if (id) {
            navigate(`/${page}/${id}`);
        } else {
            navigate(`/${page}`);
        }
    };

    return <OrderConfirmationPage orderId={id} onNavigate={handleNavigate} />;
};

// Wrapper for Checkout page
const CheckoutWrapper: React.FC = () => {
    const navigate = useNavigate();
    const { cartItems, clearCart } = useCart();
    const { currentUser, placeOrder } = useContent();

    const handleNavigate = (page: string, id?: string) => {
        if (id) {
            navigate(`/${page}/${id}`);
        } else {
            navigate(`/${page}`);
        }
    };

    const handlePlaceOrder = async () => {
        if (currentUser) {
            const newOrderId = await placeOrder(cartItems, currentUser);
            if (newOrderId) {
                clearCart();
                navigate(`/order-confirmation/${newOrderId}`);
            } else {
                alert('There was an error placing your order. Please try again.');
            }
        } else {
            alert('You must be logged in to place an order.');
            navigate('/login');
        }
    };

    return <CheckoutPage onPlaceOrder={handlePlaceOrder} onNavigate={handleNavigate} />;
};

// Wrapper for Contact page
const ContactWrapper: React.FC = () => {
    const navigate = useNavigate();

    const handleNavigate = (page: string, id?: string) => {
        if (id) {
            navigate(`/${page}/${id}`);
        } else {
            navigate(`/${page}`);
        }
    };

    const handleSendMessage = () => {
        navigate('/contact-confirmation');
    };

    return <ContactPage onNavigate={handleNavigate} onSendMessage={handleSendMessage} />;
};

// Wrapper for Login page
const LoginPageWrapper: React.FC = () => {
    const navigate = useNavigate();

    const handleNavigate = (page: string, id?: string) => {
        if (id) {
            navigate(`/${page}/${id}`);
        } else {
            navigate(`/${page}`);
        }
    };

    return <LoginPage onNavigate={handleNavigate} />;
};

// Wrapper for SignUp page
const SignUpPageWrapper: React.FC = () => {
    const navigate = useNavigate();

    const handleNavigate = (page: string, id?: string) => {
        if (id) {
            navigate(`/${page}/${id}`);
        } else {
            navigate(`/${page}`);
        }
    };

    return <SignUpPage onNavigate={handleNavigate} />;
};

// Main App component with React Router
const App: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { loading, currentUser } = useContent();
  const { notification, closeNotification } = useCart();

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-brand-gray-50">
            <div className="text-center">
                <Icon name="kytriq" className="text-techflex-blue text-5xl animate-pulse" />
                <p className="mt-4 text-lg font-semibold text-brand-gray-600">Loading Kytriq...</p>
            </div>
        </div>
    );
  }

  // Create a wrapper for the Header and Footer that can use the useNavigate hook
  const AppLayout: React.FC<{ children: React.ReactNode | ((navigate: any) => React.ReactNode) }> = ({ children }) => {
    const navigate = useNavigate();

    // Helper function for a Cart component until it's updated to use React Router
    const handleNavigate = (page: string, id?: string) => {
        if (id) {
            navigate(`/${page}/${id}`);
        } else {
            navigate(`/${page}`);
        }
    };

    return (
      <div className="bg-brand-gray-50 font-sans">
        <Header onCartToggle={() => setIsCartOpen(!isCartOpen)} />
        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onNavigate={handleNavigate} />
        <main>
            {typeof children === 'function' ? children(navigate) : children}
        </main>
        <Footer />
      </div>
    );
  };

  return (
    <Router>
      <Snackbar 
        message={notification.message}
        isOpen={notification.isOpen}
        onClose={closeNotification}
        type={notification.type}
        onViewCart={() => setIsCartOpen(true)}
      />
      <Routes>
        <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />

        {/* Product routes */}
        <Route path="/products" element={<AppLayout>{(navigate) => <ProductsPage onNavigate={(page, id) => navigate(id ? `/${page}/${id}` : `/${page}`)} />}</AppLayout>} />
        <Route path="/product/:id" element={<AppLayout><ProductDetailWrapper /></AppLayout>} />
        <Route path="/productDetail/:id" element={<AppLayout><ProductDetailWrapper /></AppLayout>} />

        {/* Software routes */}
        <Route path="/software" element={<AppLayout>{(navigate) => <SoftwarePage onNavigate={(page, id) => navigate(id ? `/${page}/${id}` : `/${page}`)} />}</AppLayout>} />
        <Route path="/software/:id" element={<AppLayout><SoftwareDetailWrapper /></AppLayout>} />
        <Route path="/softwareDetail/:id" element={<AppLayout><SoftwareDetailWrapper /></AppLayout>} />
        <Route 
          path="/software-get-started/:id" 
          element={
            <AppLayout>
              <ProtectedRoute element={<SoftwareGetStartedWrapper />} />
            </AppLayout>
          } 
        />
        <Route 
          path="/softwareGetStarted/:id" 
          element={
            <AppLayout>
              <ProtectedRoute element={<SoftwareGetStartedWrapper />} />
            </AppLayout>
          } 
        />
        <Route 
          path="/software-setup-confirmation/:id" 
          element={
            <AppLayout>
              <ProtectedRoute element={<SoftwareSetupConfirmationWrapper />} />
            </AppLayout>
          } 
        />

        {/* Blog routes */}
        <Route path="/blog" element={<AppLayout>{(navigate) => <BlogPage onNavigate={(page, id) => navigate(id ? `/${page}/${id}` : `/${page}`)} />}</AppLayout>} />
        <Route path="/blog/:id" element={<AppLayout><BlogDetailWrapper /></AppLayout>} />

        {/* E-commerce routes */}
        <Route 
          path="/checkout" 
          element={
            <AppLayout>
              <ProtectedRoute element={<CheckoutWrapper />} />
            </AppLayout>
          } 
        />
        <Route 
          path="/order-confirmation/:id" 
          element={
            <AppLayout>
              <ProtectedRoute element={<OrderConfirmationWrapper />} />
            </AppLayout>
          } 
        />
        <Route 
          path="/account" 
          element={
            <AppLayout>
              <ProtectedRoute element={(navigate) => <AccountPage onNavigate={(page, id) => navigate(id ? `/${page}/${id}` : `/${page}`)} />} />
            </AppLayout>
          } 
        />
        <Route 
          path="/orderDetail/:id" 
          element={
            <AppLayout>
              <ProtectedRoute element={<OrderDetailWrapper />} />
            </AppLayout>
          } 
        />

        {/* Service pages */}
        <Route path="/electronics" element={<AppLayout>{(navigate) => <ElectronicsPage onNavigate={(page, id) => navigate(id ? `/${page}/${id}` : `/${page}`)} />}</AppLayout>} />
        <Route path="/pos-systems" element={<AppLayout>{(navigate) => <PosSystemsPage onNavigate={(page, id) => navigate(id ? `/${page}/${id}` : `/${page}`)} />}</AppLayout>} />
        <Route path="/ecommerce" element={<AppLayout>{(navigate) => <ECommercePage onNavigate={(page, id) => navigate(id ? `/${page}/${id}` : `/${page}`)} />}</AppLayout>} />
        <Route path="/software-development" element={<AppLayout>{(navigate) => <SoftwareDevelopmentPage onNavigate={(page, id) => navigate(id ? `/${page}/${id}` : `/${page}`)} />}</AppLayout>} />

        {/* Company pages */}
        <Route path="/about" element={<AppLayout>{(navigate) => <AboutPage onNavigate={(page, id) => navigate(id ? `/${page}/${id}` : `/${page}`)} />}</AppLayout>} />
        <Route path="/careers" element={<AppLayout>{(navigate) => <CareersPage onNavigate={(page, id) => navigate(id ? `/${page}/${id}` : `/${page}`)} />}</AppLayout>} />
        <Route path="/career-application/:id" element={<AppLayout><CareerApplicationWrapper /></AppLayout>} />
        <Route path="/career-application-confirmation/:id" element={<AppLayout><CareerApplicationConfirmationWrapper /></AppLayout>} />
        <Route path="/contact" element={<AppLayout><ContactWrapper /></AppLayout>} />
        <Route path="/contact-confirmation" element={<AppLayout>{(navigate) => <ContactConfirmationPage onNavigate={(page, id) => navigate(id ? `/${page}/${id}` : `/${page}`)} />}</AppLayout>} />

        {/* Policy pages */}
        <Route path="/privacy" element={<AppLayout><PrivacyPolicyPage /></AppLayout>} />
        <Route path="/terms-of-service" element={<AppLayout><TermsOfServicePage /></AppLayout>} />
        <Route path="/cookie-policy" element={<AppLayout><CookiePolicyPage /></AppLayout>} />

        {/* Admin routes */}
        <Route 
          path="/admin/*" 
          element={
            <AppLayout>
              <ProtectedRoute element={<AdminPage />} adminOnly={true} />
            </AppLayout>
          } 
        />
        <Route 
          path="/admin-product-form/:id?" 
          element={
            <AppLayout>
              <ProtectedRoute element={<AdminProductFormWrapper />} adminOnly={true} />
            </AppLayout>
          } 
        />
        <Route 
          path="/admin-software-form/:id?" 
          element={
            <AppLayout>
              <ProtectedRoute element={<AdminSoftwareFormWrapper />} adminOnly={true} />
            </AppLayout>
          } 
        />
        <Route 
          path="/adminSoftwareForm/:id?" 
          element={
            <AppLayout>
              <ProtectedRoute element={<AdminSoftwareFormWrapper />} adminOnly={true} />
            </AppLayout>
          } 
        />
        <Route 
          path="/admin-blog-form/:id?" 
          element={
            <AppLayout>
              <ProtectedRoute element={<AdminBlogFormWrapper />} adminOnly={true} />
            </AppLayout>
          } 
        />
        <Route 
          path="/admin-career-form/:id?" 
          element={
            <AppLayout>
              <ProtectedRoute element={<AdminCareerFormWrapper />} adminOnly={true} />
            </AppLayout>
          } 
        />
        <Route 
          path="/admin-user-form/:id?" 
          element={
            <AppLayout>
              <ProtectedRoute element={<AdminUserFormWrapper />} adminOnly={true} />
            </AppLayout>
          } 
        />

        {/* Auth routes */}
        <Route path="/login" element={<AppLayout><LoginPageWrapper /></AppLayout>} />
        <Route path="/signup" element={<AppLayout><SignUpPageWrapper /></AppLayout>} />

        {/* Fallback route */}
        <Route path="*" element={<AppLayout><HomePage /></AppLayout>} />
      </Routes>
    </Router>
  );
};

export default App;
