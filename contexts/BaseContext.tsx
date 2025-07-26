import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import axios from 'axios';

// Base context interface for common functionality
export interface BaseContextState {
  loading: boolean;
  error: Error | null;
  clearError: () => void;
}

// Create a base context provider that can be extended by other context providers
export function createBaseContext<T extends BaseContextState>(name: string) {
  const Context = createContext<T | undefined>(undefined);
  
  // Create a provider component that includes common state and functionality
  const Provider: React.FC<{ children: ReactNode; initialState?: Partial<T> }> = ({ 
    children, 
    initialState 
  }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    
    // Clear error function that can be used by all context providers
    const clearError = useCallback(() => setError(null), []);
    
    // Create a function to handle API requests with proper error handling and AbortController
    const apiRequest = useCallback(async <R,>(
      requestFn: (signal: AbortSignal) => Promise<R>,
      errorMessage: string = 'API request failed'
    ): Promise<R | null> => {
      const abortController = new AbortController();
      const signal = abortController.signal;
      
      setLoading(true);
      setError(null);
      
      try {
        const result = await requestFn(signal);
        
        // Check if the request was aborted before updating state
        if (signal.aborted) return null;
        
        return result;
      } catch (err) {
        // Don't update state if the request was aborted
        if (signal.aborted) return null;
        
        // Don't log or show errors for canceled requests
        if (axios.isCancel(err)) return null;
        
        console.error(errorMessage, err);
        
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error(errorMessage));
        }
        
        return null;
      } finally {
        // Don't update loading state if the request was aborted
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    }, []);
    
    // Create a function to handle state updates with proper error handling
    const updateState = useCallback(<S,>(
      stateSetter: React.Dispatch<React.SetStateAction<S>>,
      newState: React.SetStateAction<S>,
      errorHandler?: (error: unknown) => void
    ) => {
      try {
        stateSetter(newState);
      } catch (error) {
        console.error('Error updating state:', error);
        if (errorHandler) {
          errorHandler(error);
        } else if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('Failed to update state'));
        }
      }
    }, []);
    
    // Combine the base state with any initial state provided
    const baseState: BaseContextState = {
      loading,
      error,
      clearError
    };
    
    // Create the value object with the combined state and utility functions
    const value = {
      ...baseState,
      ...initialState,
      apiRequest,
      updateState
    } as unknown as T;
    
    return (
      <Context.Provider value={value}>
        {children}
      </Context.Provider>
    );
  };
  
  // Create a custom hook to use this context
  const useBaseContext = () => {
    const context = useContext(Context);
    if (context === undefined) {
      throw new Error(`use${name}Context must be used within a ${name}Provider`);
    }
    return context;
  };
  
  return { Context, Provider, useBaseContext };
}

// Export a utility function to handle API errors consistently
export function handleApiError(error: unknown, setError: React.Dispatch<React.SetStateAction<Error | null>>, defaultMessage: string): { 
  success: false; 
  error: { 
    message: string; 
    field?: string 
  } 
} {
  console.error(defaultMessage, error);
  
  // Set the error in the context
  if (error instanceof Error) {
    setError(error);
  } else {
    setError(new Error(defaultMessage));
  }
  
  // Check if it's an ApiError with field information
  if (error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'field' in error.data) {
    return { 
      success: false, 
      error: { 
        message: error instanceof Error ? error.message : defaultMessage,
        field: error.data.field as string
      } 
    };
  }
  
  return { 
    success: false, 
    error: { 
      message: error instanceof Error ? error.message : defaultMessage
    } 
  };
}

// Export a utility function to create a memoized selector
export function createSelector<T, R>(
  selector: (state: T) => R,
  equalityFn?: (a: R, b: R) => boolean
): (state: T) => R {
  let lastState: T | undefined;
  let lastResult: R | undefined;
  
  return (state: T) => {
    if (lastState === state) {
      return lastResult as R;
    }
    
    const result = selector(state);
    
    if (!lastState || !lastResult || !equalityFn || !equalityFn(result, lastResult)) {
      lastResult = result;
    }
    
    lastState = state;
    return lastResult as R;
  };
}