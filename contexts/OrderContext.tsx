import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createBaseContext, BaseContextState } from './BaseContext';
import { OrderService } from '../services/api';
import { User } from './AuthContext';
import { Product } from './ProductContext';

// Order interface (moved from ContentContext)
export interface Order {
  id: string;
  date: string;
  customerName: string;
  status: 'Delivered' | 'Processing' | 'Shipped' | 'Cancelled';
  items: (Product & { quantity: number })[];
  total: number;
  userId: string;
}

// Order context interface
export interface OrderContextState extends BaseContextState {
  orders: Order[];
  getOrderById: (id: string) => Order | undefined;
  updateOrderStatus: (orderId: string, newStatus: Order['status']) => Promise<void>;
  placeOrder: (items: (Product & {quantity: number})[], user: User) => Promise<string | null>;
}

// Create the order context
const { Context, Provider, useBaseContext } = createBaseContext<OrderContextState>('Order');

// Export the order provider component
export const OrderProvider: React.FC<{ 
  children: React.ReactNode;
  currentUser: User | null;
}> = ({ children, currentUser }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Fetch orders when currentUser changes
  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      return;
    }
    
    const fetchOrders = async () => {
      const abortController = new AbortController();
      const signal = abortController.signal;
      
      try {
        let ordersData;
        
        // If user is admin, fetch all orders, otherwise fetch only user's orders
        if (currentUser.role === 'admin') {
          ordersData = await OrderService.getAll({}, signal);
        } else {
          // In a real implementation, you would have a dedicated endpoint for user orders
          // For now, we fetch all orders and filter on the client
          const allOrders = await OrderService.getAll({}, signal);
          ordersData = allOrders.filter((o: Order) => o.userId === currentUser.id);
        }
        
        // Check if the request was aborted before updating state
        if (!signal.aborted) {
          setOrders(ordersData || []);
        }
      } catch (error) {
        // Don't update state if the request was aborted
        if (signal.aborted) return;
        
        console.error('Error fetching orders:', error);
      }
      
      return () => {
        abortController.abort();
      };
    };
    
    fetchOrders();
  }, [currentUser]);
  
  // Get order by ID - memoized to prevent unnecessary recalculations
  const getOrderById = useCallback((id: string) => {
    return orders.find(o => o.id === id);
  }, [orders]);
  
  // Update order status
  const updateOrderStatus = useCallback(async (orderId: string, newStatus: Order['status']) => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    
    try {
      const updatedOrder = await OrderService.updateStatus(orderId, newStatus, signal);
      
      // Check if the request was aborted before updating state
      if (signal.aborted) return;
      
      // Check if updatedOrder is null or undefined before using it
      if (!updatedOrder) {
        console.error('Failed to update order status: API returned null or undefined');
        return;
      }
      
      setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
    } catch (error) {
      // Don't update state if the request was aborted
      if (signal.aborted) return;
      
      console.error('Failed to update order status:', error);
    } finally {
      abortController.abort();
    }
  }, []);
  
  // Place order
  const placeOrder = useCallback(async (items: (Product & {quantity: number})[], user: User): Promise<string | null> => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    
    try {
      const newOrder = await OrderService.create({ userId: user.id, items }, signal);
      
      // Check if the request was aborted before updating state
      if (signal.aborted) return null;
      
      // Check if newOrder is null or undefined before accessing its properties
      if (!newOrder) {
        console.error('Failed to place order: API returned null or undefined');
        return null;
      }
      
      setOrders(prev => [newOrder, ...prev]);
      return newOrder.id;
    } catch (error) {
      // Don't update state if the request was aborted
      if (signal.aborted) return null;
      
      console.error('Failed to place order:', error);
      return null;
    } finally {
      abortController.abort();
    }
  }, []);
  
  // Create the context value with memoization to prevent unnecessary re-renders
  const value = useMemo(() => ({
    orders,
    getOrderById,
    updateOrderStatus,
    placeOrder
  }), [orders, getOrderById, updateOrderStatus, placeOrder]);
  
  return (
    <Provider initialState={value}>
      {children}
    </Provider>
  );
};

// Export the hook to use the order context
export const useOrderContext = () => useBaseContext();