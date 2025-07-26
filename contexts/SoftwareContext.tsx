import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createBaseContext, BaseContextState } from './BaseContext';
import { SoftwareService } from '../services/api';

// SoftwareProduct interface (moved from ContentContext)
export interface SoftwareProduct {
  id: string;
  name: string;
  category: 'Business' | 'Creative' | 'Productivity' | 'Developer';
  price: number;
  pricingModel: 'Subscription' | 'One-Time';
  imageUrl: string;
  description: string;
  features: string[];
  logoUrl?: string;
}

// Software context interface
export interface SoftwareContextState extends BaseContextState {
  softwareProducts: SoftwareProduct[];
  getSoftwareById: (id: string) => SoftwareProduct | undefined;
  saveSoftwareProduct: (software: SoftwareProduct) => Promise<void>;
  deleteSoftwareProduct: (softwareId: string) => Promise<void>;
}

// Create the software context
const { Context, Provider, useBaseContext } = createBaseContext<SoftwareContextState>('Software');

// Export the software provider component
export const SoftwareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [softwareProducts, setSoftwareProducts] = useState<SoftwareProduct[]>([]);
  
  // Fetch software products on mount
  useEffect(() => {
    const fetchSoftwareProducts = async () => {
      const abortController = new AbortController();
      const signal = abortController.signal;
      
      try {
        const softwareData = await SoftwareService.getAll({}, signal);
        
        // Check if the request was aborted before updating state
        if (!signal.aborted) {
          setSoftwareProducts(softwareData || []);
        }
      } catch (error) {
        // Don't update state if the request was aborted
        if (signal.aborted) return;
        
        console.error('Error fetching software products:', error);
      }
      
      return () => {
        abortController.abort();
      };
    };
    
    fetchSoftwareProducts();
  }, []);
  
  // Get software product by ID - memoized to prevent unnecessary recalculations
  const getSoftwareById = useCallback((id: string) => {
    return softwareProducts.find(software => software.id === id);
  }, [softwareProducts]);
  
  // Save software product
  const saveSoftwareProduct = useCallback(async (software: SoftwareProduct) => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    
    try {
      // If software.id is undefined or empty, it's a new software product
      const isNew = !software.id || !softwareProducts.find(s => s.id === software.id);
      const savedSoftware = isNew 
        ? await SoftwareService.create(software, signal)
        : await SoftwareService.update(software.id, software, signal);
      
      // Check if the request was aborted before updating state
      if (signal.aborted) return;
      
      // Check if savedSoftware is null or undefined before accessing its properties
      if (!savedSoftware) {
        console.error('Failed to save software product: API returned null or undefined');
        return;
      }
      
      setSoftwareProducts(prev => 
        isNew 
          ? [savedSoftware, ...prev] 
          : prev.map(s => s.id === savedSoftware.id ? savedSoftware : s)
      );
    } catch (error) {
      // Don't update state if the request was aborted
      if (signal.aborted) return;
      
      console.error('Failed to save software product:', error);
    } finally {
      abortController.abort();
    }
  }, [softwareProducts]);
  
  // Delete software product
  const deleteSoftwareProduct = useCallback(async (softwareId: string) => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    
    try {
      await SoftwareService.delete(softwareId, signal);
      
      // Check if the request was aborted before updating state
      if (signal.aborted) return;
      
      setSoftwareProducts(prev => prev.filter(software => software.id !== softwareId));
    } catch (error) {
      // Don't update state if the request was aborted
      if (signal.aborted) return;
      
      console.error('Failed to delete software product:', error);
    } finally {
      abortController.abort();
    }
  }, []);
  
  // Create the context value with memoization to prevent unnecessary re-renders
  const value = useMemo(() => ({
    softwareProducts,
    getSoftwareById,
    saveSoftwareProduct,
    deleteSoftwareProduct
  }), [softwareProducts, getSoftwareById, saveSoftwareProduct, deleteSoftwareProduct]);
  
  return (
    <Provider initialState={value}>
      {children}
    </Provider>
  );
};

// Export the hook to use the software context
export const useSoftwareContext = () => useBaseContext();