import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useAuth from './use-auth';
import { AuthService } from '../services/api';

// Mock AuthService
vi.mock('../services/api', () => ({
  AuthService: {
    getCurrentUser: vi.fn(),
    login: vi.fn(),
    signup: vi.fn(),
    logout: vi.fn(),
  },
  ApiError: class {
    constructor(message) {
      this.message = message;
    }
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useAuth', () => {
  beforeEach(() => {
    console.log('beforeEach');
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should initialize with no user and not authenticating if no token', () => {
    console.log('test 1');
    const { result } = renderHook(() => useAuth());
    console.log('test 1 - after renderHook');
    expect(result.current.currentUser).toBeNull();
    expect(result.current.isAuthenticating).toBe(false);
  });

  it('should verify token on mount and set user', async () => {
    const user = { id: '1', name: 'Test User' };
    localStorage.setItem('authToken', 'test-token');
    AuthService.getCurrentUser.mockResolvedValue(user);

    let result;
    await act(async () => {
      ({ result } = renderHook(() => useAuth()));
    });

    expect(result.current.isAuthenticating).toBe(false);
    expect(result.current.currentUser).toEqual(user);
  });

  it('should handle login correctly', async () => {
    const { result } = renderHook(() => useAuth());
    const user = { id: '1', name: 'Test User' };
    const token = 'test-token';
    AuthService.login.mockResolvedValue({ user, token });

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(result.current.currentUser).toEqual(user);
    expect(localStorage.getItem('authToken')).toBe(token);
    expect(result.current.authError).toBeNull();
  });

  it('should handle signup correctly', async () => {
    const { result } = renderHook(() => useAuth());
    const user = { id: '1', name: 'Test User' };
    const token = 'test-token';
    AuthService.signup.mockResolvedValue({ user, token });

    await act(async () => {
      await result.current.signup('Test User', 'test@example.com', 'password');
    });

    expect(result.current.currentUser).toEqual(user);
    expect(localStorage.getItem('authToken')).toBe(token);
    expect(result.current.authError).toBeNull();
  });

  it('should handle logout correctly', async () => {
    // First, simulate a login
    const { result } = renderHook(() => useAuth());
    const user = { id: '1', name: 'Test User' };
    localStorage.setItem('authToken', 'test-token');
    AuthService.getCurrentUser.mockResolvedValue(user);
    await act(async () => {
      renderHook(() => useAuth());
    });

    // Then, test logout
    await act(async () => {
      result.current.logout(); // This now just opens the dialog
    });

    expect(result.current.isLogoutDialogOpen).toBe(true);

    // Manually call the confirm handler
    await act(async () => {
        await result.current.handleLogoutConfirm();
    });

    expect(result.current.currentUser).toBeNull();
    expect(localStorage.getItem('authToken')).toBeNull();
  });
});
