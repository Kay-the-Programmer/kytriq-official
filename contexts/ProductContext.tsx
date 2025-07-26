import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createBaseContext, BaseContextState, handleApiError, createSelector } from './BaseContext';
import { ProductService } from '../services/api';

// Product interface (moved from ContentContext)
export interface Product {
  id: string; 
  name: string; 
  category: 'Smartphones' | 'Laptops' | 'Audio' | 'Accessories' | 'Apparel';
  price: number; 
  originalPrice?: number; 
  imageUrl: string; 
  images: readonly string[]; 
  description: string;
  rating: number; 
  reviewCount: number; 
  tags?: ('Best Seller' | 'Selling Fast' | 'New Arrival')[];
  stockStatus?: 'In Stock' | 'Low Stock' | 'Out of Stock'; 
  colors?: { name: string; class: string }[];
  sizes?: string[]; 
  details?: { 
    description: string; 
    additionalInfo: string[]; 
    reviews: { author: string; rating: number; text: string }[] 
  };
}

// Product context interface
export interface ProductContextState extends BaseContextState {
  products: Product[];
  getProductById: (id: string) => Product | undefined;
  saveProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
}

// Create the product context
const { Context, Provider, useBaseContext } = createBaseContext<ProductContextState>('Product');

// Export the product provider component
export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  
  // Create memoized selectors
  const getProductById = useMemo(() => 
    createSelector((id: string) => products.find(p => p.id === id)),
  [products]);
  
  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      const abortController = new AbortController();
      
      try {
        const productsData = await ProductService.getAll({}, abortController.signal);
        if (!abortController.signal.aborted) {
          setProducts(productsData || []);
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error('Error fetching products:', error);
        }
      }
      
      return () => {
        abortController.abort();
      };
    };
    
    fetchProducts();
  }, []);
  
  // Save product function
  const saveProduct = useCallback(async (product: Product) => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    
    try {
      // If product.id is undefined or empty, it's a new product
      const isNew = !product.id || !products.find(p => p.id === product.id);
      const savedProduct = isNew 
        ? await ProductService.create(product, signal)
        : await ProductService.update(product.id, product, signal);
      
      // Check if the request was aborted before updating state
      if (signal.aborted) return;
      
      // Check if savedProduct is null or undefined before accessing its properties
      if (!savedProduct) {
        console.error('Failed to save product: API returned null or undefined');
        return;
      }
      
      setProducts(prev => 
        isNew 
          ? [savedProduct, ...prev] 
          : prev.map(p => p.id === savedProduct.id ? savedProduct : p)
      );
    } catch (error) {
      // Don't update state if the request was aborted
      if (signal.aborted) return;
      
      console.error('Failed to save product:', error);
    } finally {
      abortController.abort();
    }
  }, [products]);
  
  // Delete product function
  const deleteProduct = useCallback(async (productId: string) => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    
    try {
      await ProductService.delete(productId, signal);
      
      // Check if the request was aborted before updating state
      if (signal.aborted) return;
      
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      // Don't update state if the request was aborted
      if (signal.aborted) return;
      
      console.error('Failed to delete product:', error);
    } finally {
      abortController.abort();
    }
  }, []);
  
  // Create the context value with memoization to prevent unnecessary re-renders
  const value = useMemo(() => ({
    products,
    getProductById,
    saveProduct,
    deleteProduct
  }), [products, getProductById, saveProduct, deleteProduct]);
  
  return (
    <Provider initialState={value}>
      {children}
    </Provider>
  );
};

// Export the hook to use the product context
export const useProductContext = () => useBaseContext();