export interface SoftwareProduct {
  id: string;
  name: string;
  category: 'Business' | 'Creative' | 'Productivity' | 'Developer';
  price: number;
  pricingModel: 'Subscription' | 'One-Time';
  imageUrl: string;
  description: string;
  features: string[];
  logoUrl?: string; // Optional: URL to a simpler logo for the card
}

export const softwareProducts: SoftwareProduct[] = [
  {
    id: 'sw_001',
    name: 'Kytriq Synergy',
    category: 'Business',
    price: 49,
    pricingModel: 'Subscription',
    imageUrl: 'https://images.unsplash.com/photo-1556742502-ec7c0e2f34b1?q=80&w=800&auto=format&fit=crop',
    description: 'The all-in-one business management suite. Handle CRM, project management, and invoicing from a single dashboard.',
    features: ['Client Relationship Management', 'Agile Project Boards', 'Automated Invoicing', 'Team Collaboration Tools'],
    logoUrl: 'briefcase',
  },
  {
    id: 'sw_002',
    name: 'Kytriq PixelPro',
    category: 'Creative',
    price: 249,
    pricingModel: 'One-Time',
    imageUrl: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?q=80&w=800&auto=format&fit=crop',
    description: 'A powerful and intuitive design tool for digital artists and UI/UX designers. Bring your visions to life.',
    features: ['Vector and Raster Editing', 'Advanced Layering System', 'Prototyping Tools', 'Huge Asset Library'],
    logoUrl: 'code',
  },
  {
    id: 'sw_003',
    name: 'Kytriq Flow',
    category: 'Productivity',
    price: 9,
    pricingModel: 'Subscription',
    imageUrl: 'https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=800&auto=format&fit=crop',
    description: 'Organize your life and work. A smart to-do list and task manager that helps you focus on what\'s important.',
    features: ['Smart Task Scheduling', 'Cross-Device Sync', 'Goal Tracking', 'Collaboration Features'],
    logoUrl: 'compass'
  },
  {
    id: 'sw_004',
    name: 'Kytriq CodeDeploy',
    category: 'Developer',
    price: 79,
    pricingModel: 'Subscription',
    imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800&auto=format&fit=crop',
    description: 'Automate your build, test, and deployment pipeline. Ship better code, faster, with our CI/CD platform.',
    features: ['Git Integration', 'Parallel Job Execution', 'Secure Environment Variables', 'One-Click Rollbacks'],
    logoUrl: 'github'
  },
];
