import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useContent } from '../contexts/ContentContext';
import Icon from '../components/Icon';
import { usePerformanceMonitor } from '../utils/performanceMonitor';

// Lazy load heavy components
const FAQSection = lazy(() => import('../components/FAQSection'));

interface HelpPageProps {
    onNavigate?: (page: string, id: string) => void;
}

const HelpPage: React.FC<HelpPageProps> = ({ onNavigate }) => {
    const [activeCategory, setActiveCategory] = useState('Getting Started');
    const [scrollProgress, setScrollProgress] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    // Monitor component performance
    usePerformanceMonitor('HelpPage');

    // Memoized scroll progress update function
    const updateScrollProgress = useCallback(() => {
        const scrolled = window.scrollY;
        const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrolled / maxHeight) * 100;
        setScrollProgress(progress);
    }, []);

    // Optimized scroll handler with throttling and requestAnimationFrame
    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateScrollProgress();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [updateScrollProgress]);

    // Help categories
    const categories = [
        'Getting Started',
        'Account & Billing',
        'Products & Services',
        'Technical Support',
        'Troubleshooting'
    ];

    // Help articles data
    const helpArticles = {
        'Getting Started': [
            {
                id: 'gs-1',
                title: 'How to create an account',
                description: 'Learn how to create and set up your Kytriq account',
                icon: 'user-plus'
            },
            {
                id: 'gs-2',
                title: 'Navigating the dashboard',
                description: 'A guide to understanding your Kytriq dashboard',
                icon: 'layout'
            },
            {
                id: 'gs-3',
                title: 'Setting up your first project',
                description: 'Step-by-step guide to creating your first project',
                icon: 'folder-plus'
            }
        ],
        'Account & Billing': [
            {
                id: 'ab-1',
                title: 'Managing your subscription',
                description: 'How to view, change or cancel your subscription',
                icon: 'credit-card'
            },
            {
                id: 'ab-2',
                title: 'Updating payment methods',
                description: 'Learn how to add or update your payment information',
                icon: 'dollar-sign'
            },
            {
                id: 'ab-3',
                title: 'Billing FAQ',
                description: 'Frequently asked questions about billing and payments',
                icon: 'help-circle'
            }
        ],
        'Products & Services': [
            {
                id: 'ps-1',
                title: 'Software solutions overview',
                description: 'Explore our range of software solutions',
                icon: 'code'
            },
            {
                id: 'ps-2',
                title: 'Electronics product guide',
                description: 'Detailed information about our electronics products',
                icon: 'cpu'
            },
            {
                id: 'ps-3',
                title: 'POS systems explained',
                description: 'Everything you need to know about our POS systems',
                icon: 'shopping-cart'
            }
        ],
        'Technical Support': [
            {
                id: 'ts-1',
                title: 'Installation guides',
                description: 'Step-by-step installation instructions for our products',
                icon: 'download'
            },
            {
                id: 'ts-2',
                title: 'System requirements',
                description: 'Hardware and software requirements for our products',
                icon: 'server'
            },
            {
                id: 'ts-3',
                title: 'API integration help',
                description: 'Guides for integrating with our APIs',
                icon: 'code'
            }
        ],
        'Troubleshooting': [
            {
                id: 'tr-1',
                title: 'Common error messages',
                description: 'Solutions for frequently encountered error messages',
                icon: 'alert-triangle'
            },
            {
                id: 'tr-2',
                title: 'Connection issues',
                description: 'How to resolve network and connection problems',
                icon: 'wifi-off'
            },
            {
                id: 'tr-3',
                title: 'Performance optimization',
                description: 'Tips to improve the performance of our products',
                icon: 'zap'
            }
        ]
    };

    // FAQ Data
    const faqItems = [
        {
            question: "How do I contact customer support?",
            answer: "You can contact our customer support team via email at support@kytriq.com, through the live chat on our website, or by calling our support hotline at +1-800-KYTRIQ. Our support team is available 24/7 to assist you."
        },
        {
            question: "What are your support hours?",
            answer: "Our support team is available 24 hours a day, 7 days a week, including holidays. We're committed to providing timely assistance whenever you need it."
        },
        {
            question: "How quickly can I expect a response?",
            answer: "For live chat and phone support, you'll be connected with a support agent within minutes. For email inquiries, we aim to respond within 2 hours during business hours and within 8 hours outside of business hours."
        },
        {
            question: "Do you offer priority support?",
            answer: "Yes, customers on our Premium and Enterprise plans receive priority support with dedicated support agents and faster response times. Check your subscription details to see if you have access to priority support."
        },
        {
            question: "Can I schedule a support call?",
            answer: "Yes, you can schedule a support call at a time that's convenient for you. Simply go to the 'Contact Us' page on our website and select the 'Schedule a Call' option."
        }
    ];

    // Filter articles based on search query
    const filteredArticles = searchQuery 
        ? Object.values(helpArticles).flat().filter(article => 
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            article.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : helpArticles[activeCategory as keyof typeof helpArticles];

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-brand-gray-50">
            {/* Progress bar */}
            <div 
                className="fixed top-0 left-0 h-1 bg-gradient-to-r from-techflex-blue to-techflex-orange z-50 transition-all duration-300 ease-out"
                style={{ width: `${scrollProgress}%` }}
            />

            {/* Hero Section */}
            <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-brand-gray-900 mb-6 tracking-tight">
                        How can we help you?
                    </h1>
                    <p className="text-xl text-brand-gray-600 max-w-3xl mx-auto mb-10">
                        Find answers to your questions and learn how to get the most out of Kytriq products and services.
                    </p>
                    
                    {/* Search bar */}
                    <div className="max-w-2xl mx-auto relative">
                        <div className="flex items-center border-2 border-brand-gray-200 rounded-full overflow-hidden bg-white shadow-sm focus-within:shadow-lg focus-within:border-techflex-blue transition-all duration-300">
                            <Icon name="search" className="w-5 h-5 text-brand-gray-400 ml-4" />
                            <input
                                type="text"
                                placeholder="Search for help articles..."
                                className="flex-1 py-3 px-4 outline-none text-brand-gray-800"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery('')}
                                    className="mr-4 text-brand-gray-400 hover:text-brand-gray-600"
                                >
                                    <Icon name="x" className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Categories */}
                {!searchQuery && (
                    <div className="mb-12 overflow-x-auto scrollbar-hide">
                        <div className="flex space-x-4 min-w-max pb-2">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                                        activeCategory === category
                                            ? 'bg-techflex-blue text-white shadow-md'
                                            : 'bg-white text-brand-gray-600 hover:bg-brand-gray-100'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Search results or category articles */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.map((article) => (
                        <div
                            key={article.id}
                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-brand-gray-100 hover:border-techflex-blue/30 group cursor-pointer"
                            onClick={() => onNavigate && onNavigate('help-article', article.id)}
                        >
                            <div className="flex items-start">
                                <div className="bg-brand-gray-100 group-hover:bg-techflex-blue/10 p-3 rounded-lg mr-4 transition-all duration-300">
                                    <Icon name={article.icon} className="w-6 h-6 text-techflex-blue" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-brand-gray-900 group-hover:text-techflex-blue transition-all duration-300">
                                        {article.title}
                                    </h3>
                                    <p className="text-sm text-brand-gray-600 mt-1">
                                        {article.description}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <span className="text-techflex-blue text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                                    Read more
                                    <Icon name="arrow-right" className="w-4 h-4 ml-1" />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact support section */}
                <div className="mt-20 bg-gradient-to-r from-techflex-blue/10 to-techflex-orange/10 rounded-2xl p-8 border border-white">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-brand-gray-900 mb-2">
                            Can't find what you're looking for?
                        </h2>
                        <p className="text-brand-gray-600">
                            Our support team is here to help you with any questions or issues you may have.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 text-center">
                            <div className="bg-techflex-blue/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Icon name="mail" className="w-8 h-8 text-techflex-blue" />
                            </div>
                            <h3 className="font-medium text-brand-gray-900 mb-2">Email Support</h3>
                            <p className="text-sm text-brand-gray-600 mb-4">
                                Send us an email and we'll get back to you within 2 hours.
                            </p>
                            <a href="mailto:support@kytriq.com" className="text-techflex-blue font-medium hover:underline">
                                support@kytriq.com
                            </a>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 text-center">
                            <div className="bg-techflex-blue/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Icon name="message-circle" className="w-8 h-8 text-techflex-blue" />
                            </div>
                            <h3 className="font-medium text-brand-gray-900 mb-2">Live Chat</h3>
                            <p className="text-sm text-brand-gray-600 mb-4">
                                Chat with our support team in real-time for immediate assistance.
                            </p>
                            <button className="text-techflex-blue font-medium hover:underline">
                                Start a chat
                            </button>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 text-center">
                            <div className="bg-techflex-blue/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Icon name="phone" className="w-8 h-8 text-techflex-blue" />
                            </div>
                            <h3 className="font-medium text-brand-gray-900 mb-2">Phone Support</h3>
                            <p className="text-sm text-brand-gray-600 mb-4">
                                Call us directly for urgent matters or complex issues.
                            </p>
                            <a href="tel:+18005597474" className="text-techflex-blue font-medium hover:underline">
                                +1-800-KYTRIQ
                            </a>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-20">
                    <h2 className="text-2xl font-bold text-brand-gray-900 mb-8 text-center">
                        Frequently Asked Questions
                    </h2>
                    <Suspense fallback={<div className="text-center py-10">Loading FAQs...</div>}>
                        <FAQSection faqItems={faqItems} />
                    </Suspense>
                </div>
            </section>
        </div>
    );
};

export default HelpPage;