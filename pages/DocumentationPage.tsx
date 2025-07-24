import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useContent } from '../contexts/ContentContext';
import Icon from '../components/Icon';
import { usePerformanceMonitor } from '../utils/performanceMonitor';

interface DocumentationPageProps {
    onNavigate?: (page: string, id: string) => void;
}

const DocumentationPage: React.FC<DocumentationPageProps> = ({ onNavigate }) => {
    const [activeCategory, setActiveCategory] = useState('Getting Started');
    const [scrollProgress, setScrollProgress] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    // Monitor component performance
    usePerformanceMonitor('DocumentationPage');

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

    // Documentation categories
    const categories = [
        'Getting Started',
        'Software Development',
        'Electronics',
        'POS Systems',
        'API Reference',
        'Tutorials'
    ];

    // Documentation data
    const documentationItems = {
        'Getting Started': [
            {
                id: 'gs-1',
                title: 'Introduction to Kytriq',
                description: 'Learn about Kytriq and our product offerings',
                icon: 'info'
            },
            {
                id: 'gs-2',
                title: 'Quick Start Guide',
                description: 'Get up and running with Kytriq products quickly',
                icon: 'zap'
            },
            {
                id: 'gs-3',
                title: 'System Requirements',
                description: 'Hardware and software requirements for our products',
                icon: 'server'
            }
        ],
        'Software Development': [
            {
                id: 'sd-1',
                title: 'Development Environment Setup',
                description: 'Setting up your development environment for Kytriq software',
                icon: 'code'
            },
            {
                id: 'sd-2',
                title: 'Software Architecture',
                description: 'Understanding the architecture of Kytriq software solutions',
                icon: 'layers'
            },
            {
                id: 'sd-3',
                title: 'Best Practices',
                description: 'Best practices for developing with Kytriq software',
                icon: 'check-circle'
            }
        ],
        'Electronics': [
            {
                id: 'el-1',
                title: 'Hardware Specifications',
                description: 'Detailed specifications for Kytriq electronic products',
                icon: 'cpu'
            },
            {
                id: 'el-2',
                title: 'Installation Guides',
                description: 'Step-by-step installation instructions for hardware products',
                icon: 'tool'
            },
            {
                id: 'el-3',
                title: 'Troubleshooting',
                description: 'Common issues and solutions for electronic products',
                icon: 'alert-triangle'
            }
        ],
        'POS Systems': [
            {
                id: 'pos-1',
                title: 'POS System Setup',
                description: 'Setting up your Kytriq POS system',
                icon: 'shopping-cart'
            },
            {
                id: 'pos-2',
                title: 'Payment Processing',
                description: 'Configuring and using payment processing features',
                icon: 'credit-card'
            },
            {
                id: 'pos-3',
                title: 'Inventory Management',
                description: 'Managing inventory with your POS system',
                icon: 'package'
            }
        ],
        'API Reference': [
            {
                id: 'api-1',
                title: 'API Overview',
                description: 'Introduction to Kytriq APIs and authentication',
                icon: 'key'
            },
            {
                id: 'api-2',
                title: 'Endpoints Reference',
                description: 'Detailed documentation of all API endpoints',
                icon: 'link'
            },
            {
                id: 'api-3',
                title: 'Code Examples',
                description: 'Sample code for common API operations',
                icon: 'code'
            }
        ],
        'Tutorials': [
            {
                id: 'tut-1',
                title: 'Building Your First App',
                description: 'Step-by-step tutorial for building your first Kytriq app',
                icon: 'play'
            },
            {
                id: 'tut-2',
                title: 'Integration Guides',
                description: 'Guides for integrating Kytriq with other systems',
                icon: 'git-merge'
            },
            {
                id: 'tut-3',
                title: 'Video Tutorials',
                description: 'Video-based tutorials for visual learners',
                icon: 'video'
            }
        ]
    };

    // Filter documentation based on search query
    const filteredDocs = searchQuery 
        ? Object.values(documentationItems).flat().filter(doc => 
            doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            doc.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : documentationItems[activeCategory as keyof typeof documentationItems];

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
                        Documentation
                    </h1>
                    <p className="text-xl text-brand-gray-600 max-w-3xl mx-auto mb-10">
                        Comprehensive guides and reference materials for all Kytriq products and services.
                    </p>
                    
                    {/* Search bar */}
                    <div className="max-w-2xl mx-auto relative">
                        <div className="flex items-center border-2 border-brand-gray-200 rounded-full overflow-hidden bg-white shadow-sm focus-within:shadow-lg focus-within:border-techflex-blue transition-all duration-300">
                            <Icon name="search" className="w-5 h-5 text-brand-gray-400 ml-4" />
                            <input
                                type="text"
                                placeholder="Search documentation..."
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

                {/* Search results or category documentation */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDocs.map((doc) => (
                        <div
                            key={doc.id}
                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-brand-gray-100 hover:border-techflex-blue/30 group cursor-pointer"
                            onClick={() => onNavigate && onNavigate('documentation', doc.id)}
                        >
                            <div className="flex items-start">
                                <div className="bg-brand-gray-100 group-hover:bg-techflex-blue/10 p-3 rounded-lg mr-4 transition-all duration-300">
                                    <Icon name={doc.icon} className="w-6 h-6 text-techflex-blue" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-brand-gray-900 group-hover:text-techflex-blue transition-all duration-300">
                                        {doc.title}
                                    </h3>
                                    <p className="text-sm text-brand-gray-600 mt-1">
                                        {doc.description}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <span className="text-techflex-blue text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                                    Read documentation
                                    <Icon name="arrow-right" className="w-4 h-4 ml-1" />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Documentation resources section */}
                <div className="mt-20 bg-gradient-to-r from-techflex-blue/10 to-techflex-orange/10 rounded-2xl p-8 border border-white">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-brand-gray-900 mb-2">
                            Additional Resources
                        </h2>
                        <p className="text-brand-gray-600">
                            Explore these resources to enhance your understanding of Kytriq products.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 text-center">
                            <div className="bg-techflex-blue/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Icon name="book-open" className="w-8 h-8 text-techflex-blue" />
                            </div>
                            <h3 className="font-medium text-brand-gray-900 mb-2">Developer Guides</h3>
                            <p className="text-sm text-brand-gray-600 mb-4">
                                In-depth guides for developers working with Kytriq products.
                            </p>
                            <button 
                                onClick={() => onNavigate && onNavigate('documentation', 'developer-guides')}
                                className="text-techflex-blue font-medium hover:underline"
                            >
                                View guides
                            </button>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 text-center">
                            <div className="bg-techflex-blue/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Icon name="download" className="w-8 h-8 text-techflex-blue" />
                            </div>
                            <h3 className="font-medium text-brand-gray-900 mb-2">Downloads</h3>
                            <p className="text-sm text-brand-gray-600 mb-4">
                                Download SDKs, sample code, and other resources.
                            </p>
                            <button 
                                onClick={() => onNavigate && onNavigate('documentation', 'downloads')}
                                className="text-techflex-blue font-medium hover:underline"
                            >
                                Browse downloads
                            </button>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 text-center">
                            <div className="bg-techflex-blue/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Icon name="users" className="w-8 h-8 text-techflex-blue" />
                            </div>
                            <h3 className="font-medium text-brand-gray-900 mb-2">Community</h3>
                            <p className="text-sm text-brand-gray-600 mb-4">
                                Join our developer community to ask questions and share knowledge.
                            </p>
                            <button 
                                onClick={() => onNavigate && onNavigate('documentation', 'community')}
                                className="text-techflex-blue font-medium hover:underline"
                            >
                                Join community
                            </button>
                        </div>
                    </div>
                </div>

                {/* Version selector and feedback section */}
                <div className="mt-16 flex flex-col md:flex-row justify-between items-center bg-white rounded-xl p-6 shadow-sm border border-brand-gray-100">
                    <div className="flex items-center mb-4 md:mb-0">
                        <Icon name="git-branch" className="w-5 h-5 text-brand-gray-500 mr-2" />
                        <span className="text-brand-gray-700 mr-3">Documentation version:</span>
                        <select className="bg-brand-gray-100 rounded-lg px-3 py-1 text-brand-gray-800 outline-none focus:ring-2 focus:ring-techflex-blue/20">
                            <option>v2.4 (Latest)</option>
                            <option>v2.3</option>
                            <option>v2.2</option>
                            <option>v2.1</option>
                            <option>v2.0</option>
                        </select>
                    </div>
                    <div className="flex items-center">
                        <button className="flex items-center text-brand-gray-600 hover:text-techflex-blue transition-colors duration-300 mr-4">
                            <Icon name="thumbs-up" className="w-4 h-4 mr-1" />
                            <span className="text-sm">Helpful</span>
                        </button>
                        <button className="flex items-center text-brand-gray-600 hover:text-techflex-blue transition-colors duration-300 mr-4">
                            <Icon name="thumbs-down" className="w-4 h-4 mr-1" />
                            <span className="text-sm">Not helpful</span>
                        </button>
                        <button className="flex items-center text-brand-gray-600 hover:text-techflex-blue transition-colors duration-300">
                            <Icon name="edit-2" className="w-4 h-4 mr-1" />
                            <span className="text-sm">Edit page</span>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DocumentationPage;