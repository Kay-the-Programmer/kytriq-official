import React, { useState, useMemo } from 'react';
import SoftwareCard from '../components/SoftwareCard';
import { useContent } from '../contexts/ContentContext';
import Icon from '../components/Icon';

interface SoftwarePageProps {
    onNavigate: (page: string, id: string) => void;
}

// FAQ Accordion Component
const FAQItem = ({question, answer}: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-brand-gray-200">
            <button
                className="flex justify-between items-center w-full py-4 px-2 text-left focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span className="text-lg font-medium text-brand-gray-800">{question}</span>
                <Icon
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    className="h-5 w-5 text-techflex-blue"
                />
            </button>
            {isOpen && (
                <div className="pb-4 px-2 text-brand-gray-600">
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
};

// Why Shop With Us Feature Card
interface ShopFeatureCardProps {
    icon: string;
    title: string;
    description: string;
}

const ShopFeatureCard: React.FC<ShopFeatureCardProps> = ({icon, title, description}) => (
    <div className="bg-white p-6 rounded-3xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center justify-center h-14 w-14 rounded-full bg-techflex-blue-100 mb-4">
            <Icon name={icon} className="h-7 w-7 text-techflex-blue" />
        </div>
        <h3 className="text-xl font-bold text-brand-gray-800 mb-2">{title}</h3>
        <p className="text-brand-gray-600">{description}</p>
    </div>
);

const SoftwarePage: React.FC<SoftwarePageProps> = ({ onNavigate }) => {
    const { softwareProducts } = useContent();
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = useMemo(() => ['All', ...Array.from(new Set(softwareProducts.map(p => p.category)))], [softwareProducts]);

    const filteredSoftware = useMemo(() => {
        return softwareProducts.filter(software => {
            return activeCategory === 'All' || software.category === activeCategory;
        });
    }, [activeCategory, softwareProducts]);

    // FAQ Data
    const faqItems = [
        {
            question: "What types of software do you offer?",
            answer: "We offer a wide range of business software solutions including point-of-sale systems, inventory management, customer relationship management, and delivery tracking software. All our solutions are designed to help businesses operate more efficiently."
        },
        {
            question: "Do you provide technical support for your software?",
            answer: "Yes, we provide comprehensive technical support for all our software products. Our support team is available 24/7 to help you with any issues or questions you may have."
        },
        {
            question: "Can your software be customized for my specific business needs?",
            answer: "Absolutely! All our software solutions can be tailored to meet your specific business requirements. Our team will work with you to understand your needs and customize the software accordingly."
        },
        {
            question: "Is there a free trial available for your software?",
            answer: "Yes, we offer a 14-day free trial for most of our software products. This allows you to test the software and see if it meets your business needs before making a purchase."
        },
        {
            question: "How often do you update your software?",
            answer: "We regularly update our software to add new features, improve performance, and fix any bugs. Updates are typically released on a monthly basis, and all our customers receive these updates at no additional cost."
        }
    ];

    // Why Shop With Us Data
    const shopFeatures = [
        {
            icon: "shield-check",
            title: "Secure Transactions",
            description: "All transactions are encrypted and secure. We use industry-standard security protocols to protect your data."
        },
        {
            icon: "truck",
            title: "Fast Digital Delivery",
            description: "Get instant access to your software purchases with our fast digital delivery system."
        },
        {
            icon: "refresh",
            title: "30-Day Money Back",
            description: "Not satisfied? We offer a 30-day money-back guarantee on all our software products."
        },
        {
            icon: "check-circle",
            title: "Quality Assurance",
            description: "All our software undergoes rigorous testing to ensure high quality and reliability."
        }
    ];

    return (
        <div className="bg-techflex-blue-50">
            {/* Page Header */}
            <div className="bg-techflex-blue-50 py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
                    <div className="text-center ">
                        <h3 className="text-3xl py-8 md:text-5xl font-semi-bold text-brand-gray-900 tracking-tight">
                            Software to help your business grow
                        </h3>
                    </div>

                    {/* Top Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-0">
                        {/* Left: Text */}
                        <div className="flex flex-col lg:flex-row shadow-md bg-white rounded-3xl overflow-hidden">
                            <div className="lg:w-1/3 w-full p-2">
                                <div
                                    className="h-[300px] md:h-[300px] sm:h-[300px] bg-[url('/images/snap-cart.png')] bg-cover bg-center rounded-2xl"
                                />
                            </div>
                            <div className="lg:w-2/3 w-full p-6 sm:p-10 flex flex-col justify-between text-left">
                                <h3 className="text-2xl font-bold text-brand-gray-800">
                                    Seamlessly manage your business with SnapCart.
                                </h3>
                                <p className="mt-4 text-base text-brand-gray-600">
                                    Track inventory in real time, and generate instant sales reports. Simplify your retail operations with one powerful tool.                                </p>
                                <div className="mt-6">
                                    <a
                                        href="#"
                                        className="mt-4 inline-block text-blue-600 font-medium hover:underline"
                                    >
                                        Learn about SnapCart &rarr;
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Bottom Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Card */}
                        <div className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col md:flex-row w-full max-w-3xl mx-auto">
                            <div className="md:w-1/2 w-full overflow-hidden">
                                <img
                                    src="/images/swift-flex.png"
                                    alt="Software"
                                    className="w-full h-60 md:h-full object-cover transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-center">
                                <h3 className="text-2xl font-bold text-brand-gray-800">Track deliveries in real time with SwiftFlex.</h3>
                                <p className="mt-4 text-brand-gray-600">Live delivery updates for customers and dispatchers</p>
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                    }}
                                    className="mt-6 text-techflex-orange font-bold hover:text-techflex-orange-600 transition-colors duration-300"
                                >
                                    Learn more about SwiftFlex &rarr;
                                </a>
                            </div>
                        </div>
                        {/* Right Card */}

                        <div className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col md:flex-row w-full max-w-3xl mx-auto">
                            <div className="md:w-1/2 w-full overflow-hidden">
                                <img
                                    src="/images/software.png"
                                    alt="Software"
                                    className="w-full h-60 md:h-full object-cover transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-center">
                                <h3 className="text-2xl font-bold text-brand-gray-800">Live delivery updates for customers and dispatchers with SwiftFlex.</h3>
                                <p className="mt-4 text-brand-gray-600">Assign and track deliveries in real time.</p>
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                    }}
                                    className="mt-6 text-techflex-orange font-bold hover:text-techflex-orange-600 transition-colors duration-300"
                                >
                                    Learn more about SwiftFlex &rarr;
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Filters and Product Grid */}
            <div className="container bg-techflex-blue-50 mx-auto sm:px-6 lg:px-8 py-16">
                {/* Filter Bar */}
                <div className="mb-12 flex flex-col items-center gap-8" role="group"
                     aria-label="Software categories">
                    <div className="text-center">
                        <h3 className="text-xl md:text-2xl font-semi-bold text-brand-gray-900 tracking-tight">
                            Innovative software solutions and apps for your business
                        </h3>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200 ${
                                    activeCategory === category
                                        ? 'bg-techflex-blue text-white shadow'
                                        : 'bg-white text-brand-gray-700 hover:bg-brand-gray-200 border border-brand-gray-200'
                                }`}
                                aria-pressed={activeCategory === category}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Software Grid */}
                {filteredSoftware.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredSoftware.map(software => (
                            <SoftwareCard key={software.id} software={software} onNavigate={onNavigate}/>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 border-2 border-dashed border-brand-gray-200 rounded-2xl">
                        <h3 className="text-2xl font-semibold text-brand-gray-700">No software found</h3>
                        <p className="mt-2 text-brand-gray-500">Try adjusting your filter criteria.</p>
                    </div>
                )}
            </div>

            {/* Why Shop With Us Section */}
            <section className="py-16 bg-techflex-blue-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-brand-gray-900">Why Shop With Us</h2>
                        <p className="mt-4 text-lg text-brand-gray-600 max-w-2xl mx-auto">
                            We're committed to providing the best software solutions with exceptional service and support.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {shopFeatures.map((feature, index) => (
                            <ShopFeatureCard
                                key={index}
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-techflex-blue-50">
                <div className="container-fluid mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-brand-gray-900">Frequently Asked Questions</h2>
                        <p className="mt-4 text-lg text-brand-gray-600 max-w-2xl mx-auto">
                            Find answers to common questions about our software products and services.
                        </p>
                    </div>
                    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-6">
                            {faqItems.map((item, index) => (
                                <FAQItem
                                    key={index}
                                    question={item.question}
                                    answer={item.answer}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SoftwarePage;