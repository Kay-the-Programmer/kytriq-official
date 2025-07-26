import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createBaseContext, BaseContextState } from './BaseContext';
import { UserService } from '../services/api';
import { User } from './AuthContext';

// User context interface
export interface UserContextState extends BaseContextState {
  users: User[];
  getUserById: (id: string) => User | undefined;
  saveUser: (user: User) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

// Create the user context
const { Context, Provider, useBaseContext } = createBaseContext<UserContextState>('User');

// Export the user provider component
export const UserProvider: React.FC<{ 
  children: React.ReactNode;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}> = ({ children, currentUser, setCurrentUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  
  // Fetch users when currentUser changes (if admin)
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      setUsers([]);
      return;
    }
    
    const fetchUsers = async () => {
      const abortController = new AbortController();
      const signal = abortController.signal;
      
      try {
        const usersData = await UserService.getAll({}, signal);
        
        // Check if the request was aborted before updating state
        if (!signal.aborted) {
          setUsers(usersData || []);
        }
      } catch (error) {
        // Don't update state if the request was aborted
        if (signal.aborted) return;
        
        console.error('Error fetching users:', error);
      }
      
      return () => {
        abortController.abort();
      };
    };
    
    fetchUsers();
  }, [currentUser]);
  
  // Get user by ID - memoized to prevent unnecessary recalculations
  const getUserById = useCallback((id: string) => {
    return users.find(user => user.id === id);
  }, [users]);
  
  // Save user
  const saveUser = useCallback(async (user: User) => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    
    try {
      // If user.id is undefined or empty, it's a new user
      const isNew = !user.id || !users.find(u => u.id === user.id);
      const savedUser = isNew 
        ? await UserService.create(user, signal)
        : await UserService.update(user.id, user, signal);
      
      // Check if the request was aborted before updating state
      if (signal.aborted) return;
      
      // Check if savedUser is null or undefined before accessing its properties
      if (!savedUser) {
        console.error('Failed to save user: API returned null or undefined');
        return;
      }
      
      setUsers(prev => 
        isNew 
          ? [savedUser, ...prev] 
          : prev.map(u => u.id === savedUser.id ? savedUser : u)
      );
      
      // If the current user is being updated, update the currentUser state as well
      if (currentUser && currentUser.id === savedUser.id) {
        setCurrentUser(savedUser);
      }
    } catch (error) {
      // Don't update state if the request was aborted
      if (signal.aborted) return;
      
      console.error('Failed to save user:', error);
    } finally {
      abortController.abort();
    }
  }, [users, currentUser, setCurrentUser]);
  
  // Delete user
  const deleteUser = useCallback(async (userId: string) => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    
    try {
      await UserService.delete(userId, signal);
      
      // Check if the request was aborted before updating state
      if (signal.aborted) return;
      
      setUsers(prev => prev.filter(user => user.id !== userId));
      
      // If the current user is being deleted, log them out
      if (currentUser && currentUser.id === userId) {
        setCurrentUser(null);
        localStorage.removeItem('authToken');
      }
    } catch (error) {
      // Don't update state if the request was aborted
      if (signal.aborted) return;
      
      console.error('Failed to delete user:', error);
    } finally {
      abortController.abort();
    }
  }, [currentUser, setCurrentUser]);
  
  // Create the context value with memoization to prevent unnecessary re-renders
  const value = useMemo(() => ({
    users,
    getUserById,
    saveUser,
    deleteUser
  }), [users, getUserById, saveUser, deleteUser]);
  
  return (
    <Provider initialState={value}>
      {children}
    </Provider>
  );
};

// Export the hook to use the user context
export const useUserContext = () => useBaseContext();