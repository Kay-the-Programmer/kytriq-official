import { useState, useEffect, useCallback } from 'react';
import { AuthService, ApiError } from '../services/api';
import { User } from '../contexts/ContentContext';

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [authError, setAuthError] = useState<ApiError | null>(null);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsAuthenticating(false);
      return;
    }

    const verifyToken = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        // Token is invalid or expired
        localStorage.removeItem('authToken');
      } finally {
        setIsAuthenticating(false);
      }
    };

    verifyToken();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setAuthError(null);
    try {
      const { user, token } = await AuthService.login(email, password);
      localStorage.setItem('authToken', token);
      setCurrentUser(user);
      return { success: true, user };
    } catch (error) {
      const apiError = error instanceof ApiError ? error : new ApiError('Login failed');
      setAuthError(apiError);
      return { success: false, error: { message: apiError.message, field: apiError.data?.field } };
    }
  }, []);

  const signup = useCallback(async (fullName: string, email: string, password: string) => {
    setAuthError(null);
    try {
      const { user, token } = await AuthService.signup(fullName, email, password);
      localStorage.setItem('authToken', token);
      setCurrentUser(user);
      return { success: true, user };
    } catch (error) {
      const apiError = error instanceof ApiError ? error : new ApiError('Signup failed');
      setAuthError(apiError);
      return { success: false, error: { message: apiError.message, field: apiError.data?.field } };
    }
  }, []);

  const logout = useCallback(() => {
    setIsLogoutDialogOpen(true);
  }, []);

  const handleLogoutConfirm = useCallback(async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Error during API logout:', error);
      // Still proceed with client-side logout
    } finally {
      localStorage.removeItem('authToken');
      setCurrentUser(null);
      setIsLogoutDialogOpen(false);
      // Consider using a navigation library instead of hard refresh
      window.location.href = '/';
    }
  }, []);

  return {
    currentUser,
    isAuthenticating,
    authError,
    login,
    logout,
    signup,
    isLogoutDialogOpen,
    handleLogoutConfirm,
    setIsLogoutDialogOpen,
  };
};

export default useAuth;
