export interface Product {
  id: string;
  name: string;
  category: 'Smartphones' | 'Laptops' | 'Audio' | 'Accessories' | 'Apparel';
  price: number;
  originalPrice?: number;
  imageUrl: string; // Keep as main thumbnail for product lists
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

export const products: Product[] = [
  {
    id: 'prod_001',
    name: 'Cotton Jersey Top',
    category: 'Apparel',
    price: 24.99,
    originalPrice: 35.00,
    imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a164d2b?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a164d2b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581655353483-853e4a475ae4?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581655353542-3229541b5634?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581655353479-79f8867ace83?q=80&w=1200&auto=format&fit=crop',
    ],
    description: 'Button-up shirt sleeves and a relaxed silhouette. It\'s tailored with drapey, crinkle-texture fabric that\'s responsibly sourced.',
    rating: 4.8,
    reviewCount: 215,
    tags: ['Best Seller', 'Selling Fast'],
    stockStatus: 'In Stock',
    colors: [
        { name: 'Beige', class: 'bg-stone-300' },
        { name: 'Black', class: 'bg-black' },
        { name: 'Blue', class: 'bg-blue-300' },
        { name: 'White', class: 'bg-white' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    details: {
      description: 'Button-up shirt sleeves and a relaxed silhouette. It\'s tailored with drapey, crinkle-texture fabric that\'s made from LENZING™ ECOVERO™ Viscose — responsibly sourced wood-based fibres produced through a process that reduces impact on forests, biodiversity and water supply. \n\n**Features**\n- Front button placket\n- Adjustable sleeve tabs\n\n**Materials & Care**\n- Content: 100% LENZING™ ECOVERO™ Viscose\n- Care: Hand wash\n- Imported',
      additionalInfo: [
        '**Fit:** Relaxed — An easy shape that\'s just shy of loose',
        '**Length:** Classic — Intended to hit between high and low hip',
        '**Model:** 5\'9"/175cm wearing a size S'
      ],
      reviews: [
        { author: 'Jane D.', rating: 5, text: 'Absolutely love this top! The fabric is so soft and comfortable. Perfect for everyday wear.' },
        { author: 'Mark T.', rating: 4, text: 'Great shirt, very stylish. Wrinkles a bit easily but that\'s expected with the fabric. Would buy again.' },
      ]
    }
  },
  {
    id: 'prod_002',
    name: 'Kytriq NebulaBook Pro',
    category: 'Laptops',
    price: 2499.00,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop'],
    description: 'Unleash your creativity with the NebulaBook Pro. Perfect for professionals and creators.',
    rating: 4.9,
    reviewCount: 450,
  },
  {
    id: 'prod_003',
    name: 'Kytriq EchoBuds',
    category: 'Audio',
    price: 199.99,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop'],
    description: 'Immersive sound with active noise cancellation. All-day comfort and battery life.',
    rating: 4.6,
    reviewCount: 890,
  },
  {
    id: 'prod_004',
    name: 'Kytriq PowerCore+',
    category: 'Accessories',
    price: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1588701105398-a0c345d345e5?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1588701105398-a0c345d345e5?q=80&w=1200&auto=format&fit=crop'],
    description: 'A super-compact 20,000mAh portable charger with high-speed charging.',
    rating: 4.7,
    reviewCount: 1204,
  },
   {
    id: 'prod_005',
    name: 'Kytriq Fusion M1',
    category: 'Smartphones',
    price: 799.00,
    imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbf1?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1601784551446-20c9e07cdbf1?q=80&w=1200&auto=format&fit=crop'],
    description: 'The perfect balance of power and design. A flagship experience for everyone.',
    rating: 4.5,
    reviewCount: 543,
  },
];