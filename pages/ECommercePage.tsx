
import React from 'react';
import Icon from '../components/Icon';

interface ECommercePageProps {
    onNavigate: (page: string) => void;
}

const FeatureCard: React.FC<{ iconName: string; title: string; children: React.ReactNode }> = ({ iconName, title, children }) => (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-brand-gray-100 h-full">
        <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-techflex-orange-100 mb-6">
            <Icon name={iconName} className="h-8 w-8 text-techflex-orange" />
        </div>
        <h3 className="text-2xl font-bold text-brand-gray-900">{title}</h3>
        <p className="mt-3 text-brand-gray-600">{children}</p>
    </div>
);

const PlatformCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-techflex-orange-50 p-8 rounded-2xl border-2 border-techflex-orange-100 h-full">
         <h3 className="text-2xl font-bold text-techflex-orange">{title}</h3>
         <p className="mt-3 text-brand-gray-600">{children}</p>
    </div>
);


const ECommercePage: React.FC<ECommercePageProps> = ({ onNavigate }) => {

    const features = [
        { icon: 'swatch', title: 'Custom Storefront Design', description: 'Beautiful, responsive, and brand-aligned designs that create unforgettable shopping experiences and drive conversions.' },
        { icon: 'cart', title: 'Seamless Shopping Cart', description: 'An intuitive and secure checkout process designed to minimize friction and reduce cart abandonment rates.' },
        { icon: 'credit-card', title: 'Integrated Payment Gateways', description: 'Accept payments from all major providers, including Stripe, PayPal, and more, with robust security.' },
        { icon: 'cube-transparent', title: 'Product & Inventory Sync', description: 'Easily manage products, track stock levels across multiple channels, and handle complex product variants.' },
        { icon: 'chart-bar', title: 'Sales & Customer Analytics', description: 'Gain valuable insights into your store\'s performance, customer behavior, and marketing effectiveness.' },
        { icon: 'device-phone-mobile', title: 'Mobile-First Commerce', description: 'A flawless shopping experience on any device, ensuring your store looks and works perfectly on smartphones and tablets.' },
    ];

    const platforms = [
        { title: 'Shopify', description: 'Rapidly launch a powerful, scalable online store with the world\'s most popular e-commerce platform.' },
        { title: 'WooCommerce', description: 'Leverage the flexibility of WordPress to create a highly customizable and content-rich shopping experience.' },
        { title: 'Magento (Adobe Commerce)', description: 'For large-scale operations requiring enterprise-level features, security, and scalability.' },
        { title: 'Custom Solutions', description: 'A completely bespoke e-commerce platform built from the ground up to meet your unique business requirements.' },
    ];

    return (
        <div className="bg-brand-gray-50">
            {/* Hero Section */}
            <div className="relative bg-white shadow-sm text-brand-gray-900 py-24 sm:py-32">
                <div className="absolute inset-0 bg-cover bg-center opacity-5" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?auto=format&fit=crop&q=80')" }}></div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/90 to-white"></div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-brand-gray-900">Powerful E-Commerce Solutions</h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-brand-gray-600">
                        We build high-converting online stores that turn visitors into loyal customers.
                    </p>
                    <div className="mt-10">
                        <a href="#contact" className="bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-4 px-10 rounded-md text-lg transition-all duration-300 transform hover:scale-105">
                            Build Your Store
                        </a>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section className="py-20 sm:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-brand-gray-900">Everything You Need to Sell Online</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-gray-600">
                           Our e-commerce solutions are packed with features to help you succeed.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((item) => (
                            <FeatureCard key={item.title} iconName={item.icon} title={item.title}>
                                {item.description}
                            </FeatureCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Platforms Section */}
             <section className="bg-brand-gray-100 py-20 sm:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-brand-gray-900">Platforms We Master</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-gray-600">
                           We work with the industry's best platforms to find the perfect fit for your business.
                        </p>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                         {platforms.map((item) => (
                            <PlatformCard key={item.title} title={item.title}>
                                {item.description}
                            </PlatformCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="contact" className="bg-white shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <h2 className="text-4xl font-extrabold tracking-tight text-brand-gray-900">Ready to Start Selling?</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-gray-600">
                           Let's discuss your vision. We offer a free, no-obligation consultation to plan your e-commerce project.
                        </p>
                        <div className="mt-8">
                             <a href="#" className="bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-4 px-10 rounded-md text-lg transition-all duration-300 transform hover:scale-105">
                                Get a Free Proposal
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ECommercePage;
