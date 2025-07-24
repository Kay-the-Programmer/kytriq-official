import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import CallToAction from './components/CallToAction';
import BusinessSection from './components/BusinessSection';
import ExploreSection from './components/ExploreSection';
import Footer from './components/Footer';
import ScrollProgressIndicator from './components/ScrollProgressIndicator';
import BackToTop from './components/BackToTop';
import ScrollToTop from './components/ScrollToTop';
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
import SearchPage from './pages/SearchPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import OrderDetailPage from './pages/OrderDetailPage';
import AdminCareerForm from './pages/AdminCareerForm';
import AdminUserForm from './pages/AdminUserForm';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Icon from './components/Icon';
import AdminSoftwareForm from './pages/AdminSoftwareForm';
import HelpPage from './pages/HelpPage';
import DocumentationPage from './pages/DocumentationPage';
import ApiReferencePage from './pages/ApiReferencePage';
import StatusPage from './pages/StatusPage';
import SecurityPage from './pages/SecurityPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

const HomePage: React.FC = () => {
    return (
        <>
            <Hero />
            <div>
                <Features />
            </div>
            <CallToAction />
            <BusinessSection />
            <ExploreSection />
        </>
    );
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
        <ScrollProgressIndicator />
        <Header onCartToggle={() => setIsCartOpen(!isCartOpen)} />
        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onNavigate={handleNavigate} />
        <main>
            {typeof children === 'function' ? children(navigate) : children}
        </main>
        <Footer />
        <BackToTop />
      </div>
    );
  };

  return (
    <Router>
      <ScrollToTop />
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
        <Route path="/products" element={<AppLayout><ProductsPage /></AppLayout>} />
        <Route path="/product/:id" element={<AppLayout><ProductDetailPage /></AppLayout>} />
        <Route path="/productDetail/:id" element={<AppLayout><ProductDetailPage /></AppLayout>} />

        {/* Software routes */}
        <Route path="/software" element={<AppLayout><SoftwarePage /></AppLayout>} />
        <Route path="/software/:id" element={<AppLayout><SoftwareDetailPage /></AppLayout>} />
        <Route path="/softwareDetail/:id" element={<AppLayout><SoftwareDetailPage /></AppLayout>} />
        <Route 
          path="/software-get-started/:id" 
          element={
            <AppLayout>
              <ProtectedRoute element={<SoftwareGetStartedPage />} />
            </AppLayout>
          } 
        />
        <Route 
          path="/softwareGetStarted/:id" 
          element={
            <AppLayout>
              <ProtectedRoute element={<SoftwareGetStartedPage />} />
            </AppLayout>
          } 
        />
        <Route 
          path="/software-setup-confirmation/:id" 
          element={
            <AppLayout>
              <ProtectedRoute element={<SoftwareSetupConfirmationPage />} />
            </AppLayout>
          } 
        />

        {/* Blog routes */}
        <Route path="/blog" element={<AppLayout><BlogPage /></AppLayout>} />
        <Route path="/blog/:id" element={<AppLayout><BlogDetailPage /></AppLayout>} />

        {/* E-commerce routes */}
        <Route 
          path="/checkout" 
          element={
            <AppLayout>
              <ProtectedRoute element={<CheckoutPage />} />
            </AppLayout>
          } 
        />
        <Route 
          path="/order-confirmation/:id" 
          element={
            <AppLayout>
              <ProtectedRoute element={<OrderConfirmationPage />} />
            </AppLayout>
          } 
        />
        <Route 
          path="/account" 
          element={
            <AppLayout>
              <ProtectedRoute element={<AccountPage />} />
            </AppLayout>
          } 
        />
        <Route 
          path="/orderDetail/:id" 
          element={
            <AppLayout>
              <ProtectedRoute element={<OrderDetailPage />} />
            </AppLayout>
          } 
        />

        {/* Service pages */}
        <Route path="/electronics" element={<AppLayout><ElectronicsPage /></AppLayout>} />
        <Route path="/pos-systems" element={<AppLayout><PosSystemsPage /></AppLayout>} />
        <Route path="/ecommerce" element={<AppLayout><ECommercePage /></AppLayout>} />
        <Route path="/software-development" element={<AppLayout><SoftwareDevelopmentPage /></AppLayout>} />

        {/* Company pages */}
        <Route path="/about" element={<AppLayout><AboutPage /></AppLayout>} />
        <Route path="/careers" element={<AppLayout><CareersPage /></AppLayout>} />
        <Route path="/career-application/:id" element={<AppLayout><CareerApplicationPage /></AppLayout>} />
        <Route path="/career-application-confirmation/:id" element={<AppLayout><CareerApplicationConfirmationPage /></AppLayout>} />
        <Route path="/contact" element={<AppLayout><ContactPage /></AppLayout>} />
        <Route path="/contact-confirmation" element={<AppLayout><ContactConfirmationPage /></AppLayout>} />

        {/* Policy pages */}
        <Route path="/privacy" element={<AppLayout><PrivacyPolicyPage /></AppLayout>} />
        <Route path="/terms-of-service" element={<AppLayout><TermsOfServicePage /></AppLayout>} />
        <Route path="/cookie-policy" element={<AppLayout><CookiePolicyPage /></AppLayout>} />
        <Route path="/security" element={<AppLayout><SecurityPage /></AppLayout>} />
        <Route path="/search" element={<AppLayout><SearchPage /></AppLayout>} />

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
              <ProtectedRoute element={<AdminProductForm />} adminOnly={true} />
            </AppLayout>
          } 
        />
        <Route 
          path="/admin-software-form/:id?" 
          element={
            <AppLayout>
              <ProtectedRoute element={<AdminSoftwareForm />} adminOnly={true} />
            </AppLayout>
          } 
        />
        <Route 
          path="/adminSoftwareForm/:id?" 
          element={
            <AppLayout>
              <ProtectedRoute element={<AdminSoftwareForm />} adminOnly={true} />
            </AppLayout>
          } 
        />
        <Route 
          path="/admin-blog-form/:id?" 
          element={
            <AppLayout>
              <ProtectedRoute element={<AdminBlogForm />} adminOnly={true} />
            </AppLayout>
          } 
        />
        <Route 
          path="/admin-career-form/:id?" 
          element={
            <AppLayout>
              <ProtectedRoute element={<AdminCareerForm />} adminOnly={true} />
            </AppLayout>
          } 
        />
        <Route 
          path="/admin-user-form/:id?" 
          element={
            <AppLayout>
              <ProtectedRoute element={<AdminUserForm />} adminOnly={true} />
            </AppLayout>
          } 
        />

        {/* Auth routes */}
        <Route path="/login" element={<AppLayout><LoginPage /></AppLayout>} />
        <Route path="/signup" element={<AppLayout><SignUpPage /></AppLayout>} />

        {/* Support routes */}
        <Route path="/help" element={<AppLayout><HelpPage /></AppLayout>} />
        <Route path="/docs" element={<AppLayout><DocumentationPage /></AppLayout>} />
        <Route 
          path="/api" 
          element={
            <AppLayout>
              <ProtectedRoute 
                element={<ApiReferencePage />}
                adminOnly={true} 
              />
            </AppLayout>
          } 
        />
        <Route path="/status" element={<AppLayout><StatusPage /></AppLayout>} />

        {/* Access control */}
        <Route path="/unauthorized" element={<AppLayout><UnauthorizedPage /></AppLayout>} />

        {/* Fallback route */}
        <Route path="*" element={<AppLayout><HomePage /></AppLayout>} />
      </Routes>
    </Router>
  );
};

export default App;
