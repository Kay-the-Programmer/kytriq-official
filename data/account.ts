

import type { Product } from './products';

export interface User {
  id: string;
  fullName: string;
  email: string;
  password?: string; // Optional for mock, required for real users
  role: 'admin' | 'customer';
  memberSince: string;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zip: string;
  };
}

interface OrderItem extends Product {
  quantity: number;
}

export interface Order {
  id:string;
  date: string;
  customerName: string;
  status: 'Delivered' | 'Processing' | 'Shipped' | 'Cancelled';
  items: OrderItem[];
  total: number;
}

export const mockUsers: User[] = [
  {
    id: 'user_123',
    fullName: 'Alex Doe',
    email: 'alex.doe@example.com',
    password: 'password123',
    role: 'admin',
    memberSince: '2022-08-15',
    shippingAddress: {
      address: '123 Tech Lane',
      city: 'Innovateville',
      state: 'CA',
      zip: '94043',
    },
  },
  {
    id: 'user_456',
    fullName: 'Jane Smith',
    email: 'jane.smith@example.com',
    password: 'password123',
    role: 'customer',
    memberSince: '2023-01-10',
    shippingAddress: {
      address: '456 Innovation Drive',
      city: 'Coderville',
      state: 'NY',
      zip: '10001',
    },
  }
];

const mockOrderItems = {
  nebulaBook: {
    id: 'prod_002', name: 'Kytriq NebulaBook Pro', category: 'Laptops', price: 2499.00, imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop',
    images: [], description: '', rating: 4.9, reviewCount: 450,
  },
  powerCore: {
    id: 'prod_004', name: 'Kytriq PowerCore+', category: 'Accessories', price: 89.99, imageUrl: 'https://images.unsplash.com/photo-1588701105398-a0c345d345e5?q=80&w=800&auto=format&fit=crop',
    images: [], description: '', rating: 4.7, reviewCount: 1204,
  },
  fusionM1: {
    id: 'prod_005', name: 'Kytriq Fusion M1', category: 'Smartphones', price: 799.00, imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbf1?q=80&w=800&auto=format&fit=crop',
    images: [], description: '', rating: 4.5, reviewCount: 543,
  },
  echoBuds: {
    id: 'prod_003', name: 'Kytriq EchoBuds', category: 'Audio', price: 199.99, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
    images: [], description: '', rating: 4.6, reviewCount: 890,
  },
    cottonTop: {
    id: 'prod_001', name: 'Cotton Jersey Top', category: 'Apparel', price: 24.99, imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a164d2b?q=80&w=800&auto=format&fit=crop',
    images: [], description: '', rating: 4.8, reviewCount: 215,
  }
} as const;


export const mockOrders: Order[] = [
    {
        id: 'KYT-98770',
        date: '2024-07-28',
        customerName: 'Jane Smith',
        status: 'Processing',
        items: [
          { ...mockOrderItems.fusionM1, quantity: 1 },
          { ...mockOrderItems.echoBuds, quantity: 1 },
        ],
        total: 998.99,
    },
    {
        id: 'KYT-98768',
        date: '2024-07-26',
        customerName: 'Jane Smith',
        status: 'Shipped',
        items: [
          { ...mockOrderItems.cottonTop, quantity: 2 },
        ],
        total: 49.98,
    },
  {
    id: 'KYT-98765',
    date: '2024-07-22',
    customerName: 'Alex Doe',
    status: 'Delivered',
    items: [
      { ...mockOrderItems.nebulaBook, quantity: 1 },
      { ...mockOrderItems.powerCore, quantity: 1 },
    ],
    total: 2588.99,
  },
  {
    id: 'KYT-98760',
    date: '2024-06-15',
    customerName: 'Alex Doe',
    status: 'Delivered',
    items: [
      { ...mockOrderItems.fusionM1, quantity: 1 },
    ],
    total: 799.00,
  },
    {
    id: 'KYT-98758',
    date: '2024-05-10',
    customerName: 'Jane Smith',
    status: 'Cancelled',
    items: [
      { ...mockOrderItems.echoBuds, quantity: 1 },
    ],
    total: 199.99,
  },
  {
    id: 'KYT-98755',
    date: '2024-03-01',
    customerName: 'Alex Doe',
    status: 'Delivered',
    items: [
      { ...mockOrderItems.echoBuds, quantity: 2 },
      { ...mockOrderItems.powerCore, quantity: 1 },
    ],
    total: 489.97,
  },
];