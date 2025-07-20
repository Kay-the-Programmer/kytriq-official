import mongoose from 'mongoose';
import 'dotenv/config';
import Software from '../models/SoftwareProduct';

async function seed() {
    await mongoose.connect(process.env.MONGODB_URI as string);

    // replace with your own initial data
    const docs = [
        {
            name: 'Acme CRM',
            category: 'Customer Management',
            description: 'Manage your customers with ease.',
            logoUrl: 'acme-logo',
            price: 49,
            pricingModel: 'Subscription',
            features: ['360° customer view', 'Email automation', 'Reports']
        },
        {
            id: 'sw_001',
            name: 'Kytriq Synergy',
            category: 'Business',
            price: 49,
            pricingModel: 'Subscription',
            imageUrl: 'https://images.unsplash.com/photo-1556742502-ec7c0e2f34b1?q=80&w=800&auto=format&fit=crop',
            description: 'The all-in-one business management suite.', features: ['CRM', 'Project Management', 'Invoicing'], logoUrl: 'briefcase',
        }
    ];

    await Software.deleteMany({});
    await Software.insertMany(docs);
    console.log('Seed complete – inserted', docs.length, 'documents');
    await mongoose.disconnect();
}

seed().catch(console.error);