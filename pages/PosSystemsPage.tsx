
import React from 'react';
import Icon from '../components/Icon';

interface PosSystemsPageProps {
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

const BusinessTypeCard: React.FC<{ iconName: string; title: string }> = ({ iconName, title }) => (
    <div className="text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-techflex-blue-100 ring-4 ring-white shadow-md">
            <Icon name={iconName} className="h-12 w-12 text-techflex-blue-600" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-brand-gray-800">{title}</h3>
    </div>
);


const PosSystemsPage: React.FC<PosSystemsPageProps> = ({ onNavigate }) => {

    const features = [
        { icon: 'sparkles', title: 'Intuitive Interface', description: 'Easy-to-use and customizable interface that requires minimal training, allowing your staff to start selling in minutes.' },
        { icon: 'cube-transparent', title: 'Inventory Management', description: 'Track stock levels in real-time, get low-stock alerts, and manage suppliers all from one dashboard.' },
        { icon: 'users', title: 'Customer Insights', description: 'Build customer profiles, track purchase history, and create loyalty programs to keep your customers coming back.' },
        { icon: 'chart-bar', title: 'Powerful Analytics', description: 'Make data-driven decisions with detailed reports on sales, top-performing products, and peak business hours.' },
        { icon: 'printer', title: 'Hardware Integration', description: 'Seamlessly connect to receipt printers, barcode scanners, cash drawers, and other essential peripherals.' },
        { icon: 'credit-card', title: 'Secure Payments', description: 'Accept all types of payments, including credit, debit, and mobile, with end-to-end encryption and PCI compliance.' },
    ];
    
    const businessTypes = [
        { icon: 'building-storefront', title: 'Retail Stores' },
        { icon: 'cake', title: 'Cafes & Restaurants' },
        { icon: 'fire', title: 'Quick-Service' },
        { icon: 'briefcase', title: 'Boutiques & Salons' },
    ];

    return (
        <div className="bg-brand-gray-50">
            {/* Hero Section */}
            <div className="relative bg-techflex-blue text-white py-24 sm:py-32">
                <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556742502-ec7c0e2f34b1?auto=format&fit=crop&q=80')" }}></div>
                <div className="absolute inset-0 bg-gradient-to-b from-techflex-blue/90 to-techflex-blue"></div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Modern Point-of-Sale Systems</h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-brand-gray-200">
                        Streamline sales, manage inventory, and understand your customers with our intuitive and powerful POS solutions.
                    </p>
                    <div className="mt-10">
                        <a href="#contact" className="bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-4 px-10 rounded-lg text-lg transition-all duration-300 transform hover:scale-105">
                            Get a Demo
                        </a>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section className="py-20 sm:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-brand-gray-900">Why Kytriq POS?</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-gray-600">
                           Everything you need to run your business smoothly and efficiently.
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
            
            {/* Business Types Section */}
             <section className="bg-brand-gray-100 py-20 sm:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-brand-gray-900">Perfect For Any Business</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-gray-600">
                           Our POS system is flexible and scalable to fit the unique needs of your industry.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                         {businessTypes.map((item) => (
                            <BusinessTypeCard key={item.title} iconName={item.icon} title={item.title} />
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Hardware Section */}
            <section className="py-20 sm:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                             <h2 className="text-4xl font-extrabold text-brand-gray-900">A Complete Hardware Ecosystem</h2>
                             <p className="mt-4 text-lg text-brand-gray-600">
                                We offer a range of reliable and sleek hardware that works perfectly with our software. Get everything you need from a single provider.
                             </p>
                             <ul className="mt-8 space-y-4">
                                <li className="flex items-center gap-3"><Icon name="check-circle" className="h-6 w-6 text-techflex-orange" /><span className="text-lg">POS Terminal & Stand</span></li>
                                <li className="flex items-center gap-3"><Icon name="check-circle" className="h-6 w-6 text-techflex-orange" /><span className="text-lg">High-Speed Receipt Printer</span></li>
                                <li className="flex items-center gap-3"><Icon name="check-circle" className="h-6 w-6 text-techflex-orange" /><span className="text-lg">Barcode Scanner</span></li>
                                <li className="flex items-center gap-3"><Icon name="check-circle" className="h-6 w-6 text-techflex-orange" /><span className="text-lg">Secure Cash Drawer</span></li>
                                <li className="flex items-center gap-3"><Icon name="check-circle" className="h-6 w-6 text-techflex-orange" /><span className="text-lg">Customer-Facing Display</span></li>
                             </ul>
                        </div>
                        <div>
                            <img src="https://images.unsplash.com/photo-1577234286674-8d48a1c84a86?q=80&w=1200&auto=format&fit=crop" alt="POS Hardware" className="rounded-2xl shadow-2xl" />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="contact" className="bg-techflex-blue">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center text-white">
                        <h2 className="text-4xl font-extrabold tracking-tight">Ready to Revolutionize Your Business?</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-gray-200">
                           Schedule a personalized demo with one of our specialists to see how Kytriq POS can work for you.
                        </p>
                        <div className="mt-8">
                             <a href="#" className="bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-4 px-10 rounded-lg text-lg transition-all duration-300 transform hover:scale-105">
                                Schedule a Demo
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PosSystemsPage;
