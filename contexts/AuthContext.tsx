import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createBaseContext, BaseContextState, handleApiError } from './BaseContext';
import { AuthService, ApiError } from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';

// User interface (moved from ContentContext)
export interface User {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  role: 'admin' | 'customer';
  memberSince: string;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zip: string;
  };
}

// Auth context interface
export interface AuthContextState extends BaseContextState {
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
}

// Create the auth context
const { Context, Provider, useBaseContext } = createBaseContext<AuthContextState>('Auth');

// Export the auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Check for existing auth token and fetch current user on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const abortController = new AbortController();

      try {
        const userData = await AuthService.getCurrentUser(abortController.signal);
        if (!abortController.signal.aborted && userData) {
          setCurrentUser(userData);
        } else if (!abortController.signal.aborted) {
          // Clear the token if user data couldn't be fetched
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error('Error fetching current user:', error);
          // Clear the token if there was an error
          localStorage.removeItem('authToken');
        }
      }

      return () => {
        abortController.abort();
      };
    };

    fetchCurrentUser();
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string): Promise<{ 
    success: boolean; 
    user?: User; 
    error?: { message: string; field?: string } 
  }> => {
    const abortController = new AbortController();

    try {
      const response = await AuthService.login(email, password, abortController.signal);

      // Check if the request was aborted
      if (abortController.signal.aborted) {
        return { success: false, error: { message: 'Request was cancelled' } };
      }

      // Check if response is null or undefined
      if (!response) {
        setError(new Error('Failed to login: API returned null or undefined'));
        return { success: false, error: { message: 'Login failed: API returned null or undefined' } };
      }

      const { user, token } = response;

      // Store the auth token in localStorage
      if (token) {
        localStorage.setItem('authToken', token);
        console.log('Auth token stored in localStorage after login:', token);
      } else {
        console.error('No auth token received from login response');
      }

      // Set currentUser
      setCurrentUser(user);

      return { success: true, user };
    } catch (error) {
      // Check if the request was aborted
      if (abortController.signal.aborted) {
        return { success: false, error: { message: 'Request was cancelled' } };
      }

      console.error('Login error:', error);
      return handleApiError(error, setError, 'Login failed');
    } finally {
      abortController.abort();
    }
  }, []);

  // Logout confirmation handler
  const handleLogoutConfirm = useCallback(async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
      // Continue with logout process even if the API call fails
    }

    // Clear the token from localStorage
    localStorage.removeItem('authToken');
    setCurrentUser(null);
    setIsLogoutDialogOpen(false);
  }, []);

  // Logout function - shows confirmation dialog
  const logout = useCallback(() => {
    setIsLogoutDialogOpen(true);
  }, []);

  // Signup function
  const signup = useCallback(async (fullName: string, email: string, password: string): Promise<{ 
    success: boolean; 
    user?: User; 
    error?: { message: string; field?: string } 
  }> => {
    const abortController = new AbortController();

    try {
      const response = await AuthService.signup(fullName, email, password, abortController.signal);

      // Check if the request was aborted
      if (abortController.signal.aborted) {
        return { success: false, error: { message: 'Request was cancelled' } };
      }

      // Check if response is null or undefined
      if (!response) {
        setError(new Error('Failed to signup: API returned null or undefined'));
        return { success: false, error: { message: 'Signup failed: API returned null or undefined' } };
      }

      const { user, token } = response;

      // Store the auth token in localStorage
      if (token) {
        localStorage.setItem('authToken', token);
        console.log('Auth token stored in localStorage after signup:', token);
      } else {
        console.error('No auth token received from signup response');
      }

      // Set currentUser
      setCurrentUser(user);

      return { success: true, user };
    } catch (error) {
      // Check if the request was aborted
      if (abortController.signal.aborted) {
        return { success: false, error: { message: 'Request was cancelled' } };
      }

      console.error('Signup error:', error);
      return handleApiError(error, setError, 'Signup failed');
    } finally {
      abortController.abort();
    }
  }, []);

  // Create the context value with memoization to prevent unnecessary re-renders
  const value = useMemo(() => ({
    currentUser,
    login,
    logout,
    signup,
    error,
    clearError: () => setError(null),
    loading: false
  }), [currentUser, login, logout, signup, error]);

  return (
    <Provider initialState={value}>
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
    </Provider>
  );
};

// Export the hook to use the auth context
export const useAuthContext = () => useBaseContext();
