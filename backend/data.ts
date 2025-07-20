
// This file acts as an in-memory database, centralizing all data.

// Interfaces
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
    reviews: { author: string; rating: number; text: string }[];
  };
}

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

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  authorAvatarUrl: string;
  date: string;
  tags: string[];
  imageUrl: string;
  excerpt: string;
  content: string;
}

export interface JobOpening {
  id: string;
  title: string;
  department: 'Engineering' | 'Design' | 'Marketing' | 'Product';
  location: 'Remote' | 'San Francisco, CA' | 'New York, NY' | 'Hybrid';
  type: 'Full-time' | 'Part-time' | 'Contract';
  description: string;
  responsibilities: string[];
  qualifications: string[];
}

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

export interface Order {
  id:string;
  date: string;
  customerName: string;
  userId: string;
  status: 'Delivered' | 'Processing' | 'Shipped' | 'Cancelled';
  items: (Product & { quantity: number })[];
  total: number;
}


// Data Store
let products: Product[] = [
    {
    id: 'prod_001', name: 'Cotton Jersey Top', category: 'Apparel', price: 24.99, originalPrice: 35.00,
    imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a164d2b?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1581655353564-df123a164d2b?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1581655353483-853e4a475ae4?q=80&w=1200&auto=format&fit=crop'],
    description: 'Button-up shirt sleeves and a relaxed silhouette.', rating: 4.8, reviewCount: 215, tags: ['Best Seller', 'Selling Fast'], stockStatus: 'In Stock',
    colors: [{ name: 'Beige', class: 'bg-stone-300' }, { name: 'Black', class: 'bg-black' }], sizes: ['S', 'M', 'L', 'XL'],
    details: { description: 'A very nice shirt.', additionalInfo: ['Fit: Relaxed'], reviews: [{ author: 'Jane D.', rating: 5, text: 'Love it!' }]}
  },
  {
    id: 'prod_002', name: 'Kytriq NebulaBook Pro', category: 'Laptops', price: 2499.00, imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop'], description: 'Unleash your creativity.', rating: 4.9, reviewCount: 450,
  },
];

let softwareProducts: SoftwareProduct[] = [
  {
    id: 'sw_001', name: 'Kytriq Synergy', category: 'Business', price: 49, pricingModel: 'Subscription',
    imageUrl: 'https://images.unsplash.com/photo-1556742502-ec7c0e2f34b1?q=80&w=800&auto=format&fit=crop',
    description: 'The all-in-one business management suite.', features: ['CRM', 'Project Management', 'Invoicing'], logoUrl: 'briefcase',
  },
];

let blogPosts: BlogPost[] = [
  {
    id: 'blog_001', title: 'The Future of AI', author: 'Jane Doe', authorAvatarUrl: 'https://i.pravatar.cc/150?u=jane_doe', date: '2024-07-28',
    tags: ['AI', 'Development'], imageUrl: 'https://images.unsplash.com/photo-1678494883901-da7989395245?q=80&w=800&auto=format&fit=crop',
    excerpt: 'AI is transforming software development...', content: 'Full content about AI...'
  },
];

let jobOpenings: JobOpening[] = [
  {
    id: 'job_eng_01', title: 'Senior Frontend Engineer (React)', department: 'Engineering', location: 'Remote', type: 'Full-time',
    description: 'We are looking for an experienced Frontend Engineer...',
    responsibilities: ['Develop and maintain high-quality UIs.'], qualifications: ['5+ years of experience.'],
  },
];

let users: User[] = [
  {
    id: 'user_123', fullName: 'Alex Doe', email: 'admin@kytriq.com', password: 'password123', role: 'admin', memberSince: '2022-08-15',
    shippingAddress: { address: '123 Tech Lane', city: 'Innovateville', state: 'CA', zip: '94043' },
  },
  {
    id: 'user_456', fullName: 'Jane Smith', email: 'customer@kytriq.com', password: 'password123', role: 'customer', memberSince: '2023-01-10',
    shippingAddress: { address: '456 Innovation Drive', city: 'Coderville', state: 'NY', zip: '10001' },
  }
];

let orders: Order[] = [
  {
    id: 'KYT-98765', date: '2024-07-22', customerName: 'Alex Doe', userId: 'user_123', status: 'Delivered',
    items: [{ ...(products.find(p => p.id === 'prod_002')!), quantity: 1 }], total: 2588.99,
  },
];


// Data Access & Manipulation Functions
export const getData = () => ({
    products, softwareProducts, blogPosts, jobOpenings, users, orders
});

export const findProduct = (id: string) => products.find(p => p.id === id);
export const saveProduct = (product: Product) => {
    const index = products.findIndex(p => p.id === product.id);
    if (index > -1) products[index] = product;
    else products.unshift(product);
    return product;
};
export const deleteProduct = (id: string) => {
    products = products.filter(p => p.id !== id);
};

export const findSoftwareProduct = (id: string) => softwareProducts.find(s => s.id === id);
export const saveSoftwareProduct = (softwareProduct: SoftwareProduct) => {
    const index = softwareProducts.findIndex(p => p.id === softwareProduct.id);
    if (index > -1) softwareProducts[index] = softwareProduct;
    else softwareProducts.unshift(softwareProduct);
    return softwareProduct;
};
export const deleteSoftwareProduct = (id: string) => {
    softwareProducts = softwareProducts.filter(p => p.id !== id);
};

export const findUser = (id: string) => users.find(u => u.id === id);
export const findUserByEmail = (email: string) => users.find(u => u.email === email);
export const saveUser = (user: User) => {
    const index = users.findIndex(u => u.id === user.id);
    if (index > -1) users[index] = user;
    else users.unshift(user);
    return user;
};
export const deleteUser = (id: string) => {
    users = users.filter(u => u.id !== id);
};

export const saveBlogPost = (post: BlogPost) => {
    const index = blogPosts.findIndex(p => p.id === post.id);
    if (index > -1) blogPosts[index] = post;
    else blogPosts.unshift(post);
    return post;
};
export const deleteBlogPost = (id: string) => {
    blogPosts = blogPosts.filter(p => p.id !== id);
};

export const saveJobOpening = (job: JobOpening) => {
    const index = jobOpenings.findIndex(j => j.id === job.id);
    if (index > -1) jobOpenings[index] = job;
    else jobOpenings.unshift(job);
    return job;
};
export const deleteJobOpening = (id: string) => {
    jobOpenings = jobOpenings.filter(j => j.id !== id);
};

export const findOrder = (id: string) => orders.find(o => o.id === id);
export const saveOrder = (order: Order) => {
    const index = orders.findIndex(o => o.id === order.id);
    if(index > -1) orders[index] = order;
    else orders.unshift(order);
    return order;
};
