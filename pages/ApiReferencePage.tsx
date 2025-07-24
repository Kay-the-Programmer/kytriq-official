import React, { useState, useEffect, useCallback } from 'react';
import { useContent } from '../contexts/ContentContext';
import Icon from '../components/Icon';
import { usePerformanceMonitor } from '../utils/performanceMonitor';
import { Navigate } from 'react-router-dom';

interface ApiReferencePageProps {
    onNavigate?: (page: string, id: string) => void;
}

const ApiReferencePage: React.FC<ApiReferencePageProps> = ({ onNavigate }) => {
    const { currentUser } = useContent();
    const [activeCategory, setActiveCategory] = useState('Overview');
    const [scrollProgress, setScrollProgress] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);

    // Redirect non-admin users
    if (!currentUser || currentUser.role !== 'admin') {
        return <Navigate to="/unauthorized" replace />;
    }

    // Monitor component performance
    usePerformanceMonitor('ApiReferencePage');

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

    // API categories
    const categories = [
        'Overview',
        'Authentication',
        'Users',
        'Products',
        'Orders',
        'Webhooks',
        'SDKs'
    ];

    // API endpoints data
    const apiEndpoints = {
        'Overview': [
            {
                id: 'overview-intro',
                title: 'Introduction',
                description: 'Overview of the Kytriq API and its capabilities',
                icon: 'info'
            },
            {
                id: 'overview-versioning',
                title: 'API Versioning',
                description: 'Understanding API versions and backward compatibility',
                icon: 'git-branch'
            },
            {
                id: 'overview-rate-limits',
                title: 'Rate Limits',
                description: 'API rate limits and best practices for handling them',
                icon: 'activity'
            }
        ],
        'Authentication': [
            {
                id: 'auth-keys',
                title: 'API Keys',
                description: 'How to generate and manage API keys',
                icon: 'key'
            },
            {
                id: 'auth-oauth',
                title: 'OAuth 2.0',
                description: 'Implementing OAuth 2.0 authentication',
                icon: 'lock'
            },
            {
                id: 'auth-jwt',
                title: 'JWT Tokens',
                description: 'Working with JWT tokens for authentication',
                icon: 'shield'
            }
        ],
        'Users': [
            {
                id: 'users-get',
                title: 'GET /api/users',
                description: 'Retrieve a list of users',
                method: 'GET',
                endpoint: '/api/users',
                parameters: [
                    { name: 'limit', type: 'integer', description: 'Number of users to return (default: 10)' },
                    { name: 'offset', type: 'integer', description: 'Pagination offset (default: 0)' },
                    { name: 'sort', type: 'string', description: 'Sort field (e.g., "created_at")' }
                ],
                responses: [
                    { code: '200', description: 'Success' },
                    { code: '401', description: 'Unauthorized' },
                    { code: '403', description: 'Forbidden' }
                ],
                icon: 'users'
            },
            {
                id: 'users-get-id',
                title: 'GET /api/users/{id}',
                description: 'Retrieve a specific user by ID',
                method: 'GET',
                endpoint: '/api/users/{id}',
                parameters: [
                    { name: 'id', type: 'string', description: 'User ID', required: true }
                ],
                responses: [
                    { code: '200', description: 'Success' },
                    { code: '404', description: 'User not found' },
                    { code: '401', description: 'Unauthorized' }
                ],
                icon: 'user'
            },
            {
                id: 'users-post',
                title: 'POST /api/users',
                description: 'Create a new user',
                method: 'POST',
                endpoint: '/api/users',
                parameters: [
                    { name: 'name', type: 'string', description: 'User name', required: true },
                    { name: 'email', type: 'string', description: 'User email', required: true },
                    { name: 'role', type: 'string', description: 'User role (default: "user")' }
                ],
                responses: [
                    { code: '201', description: 'Created' },
                    { code: '400', description: 'Bad request' },
                    { code: '401', description: 'Unauthorized' }
                ],
                icon: 'user-plus'
            }
        ],
        'Products': [
            {
                id: 'products-get',
                title: 'GET /api/products',
                description: 'Retrieve a list of products',
                method: 'GET',
                endpoint: '/api/products',
                parameters: [
                    { name: 'limit', type: 'integer', description: 'Number of products to return (default: 10)' },
                    { name: 'offset', type: 'integer', description: 'Pagination offset (default: 0)' },
                    { name: 'category', type: 'string', description: 'Filter by category' }
                ],
                responses: [
                    { code: '200', description: 'Success' },
                    { code: '401', description: 'Unauthorized' }
                ],
                icon: 'package'
            },
            {
                id: 'products-get-id',
                title: 'GET /api/products/{id}',
                description: 'Retrieve a specific product by ID',
                method: 'GET',
                endpoint: '/api/products/{id}',
                parameters: [
                    { name: 'id', type: 'string', description: 'Product ID', required: true }
                ],
                responses: [
                    { code: '200', description: 'Success' },
                    { code: '404', description: 'Product not found' },
                    { code: '401', description: 'Unauthorized' }
                ],
                icon: 'box'
            }
        ],
        'Orders': [
            {
                id: 'orders-get',
                title: 'GET /api/orders',
                description: 'Retrieve a list of orders',
                method: 'GET',
                endpoint: '/api/orders',
                parameters: [
                    { name: 'limit', type: 'integer', description: 'Number of orders to return (default: 10)' },
                    { name: 'offset', type: 'integer', description: 'Pagination offset (default: 0)' },
                    { name: 'status', type: 'string', description: 'Filter by status' }
                ],
                responses: [
                    { code: '200', description: 'Success' },
                    { code: '401', description: 'Unauthorized' }
                ],
                icon: 'shopping-bag'
            },
            {
                id: 'orders-post',
                title: 'POST /api/orders',
                description: 'Create a new order',
                method: 'POST',
                endpoint: '/api/orders',
                parameters: [
                    { name: 'user_id', type: 'string', description: 'User ID', required: true },
                    { name: 'products', type: 'array', description: 'Array of product IDs and quantities', required: true },
                    { name: 'shipping_address', type: 'object', description: 'Shipping address details', required: true }
                ],
                responses: [
                    { code: '201', description: 'Created' },
                    { code: '400', description: 'Bad request' },
                    { code: '401', description: 'Unauthorized' }
                ],
                icon: 'plus-circle'
            }
        ],
        'Webhooks': [
            {
                id: 'webhooks-get',
                title: 'GET /api/webhooks',
                description: 'Retrieve a list of webhooks',
                method: 'GET',
                endpoint: '/api/webhooks',
                parameters: [],
                responses: [
                    { code: '200', description: 'Success' },
                    { code: '401', description: 'Unauthorized' }
                ],
                icon: 'bell'
            },
            {
                id: 'webhooks-post',
                title: 'POST /api/webhooks',
                description: 'Create a new webhook',
                method: 'POST',
                endpoint: '/api/webhooks',
                parameters: [
                    { name: 'url', type: 'string', description: 'Webhook URL', required: true },
                    { name: 'events', type: 'array', description: 'Array of events to subscribe to', required: true },
                    { name: 'description', type: 'string', description: 'Webhook description' }
                ],
                responses: [
                    { code: '201', description: 'Created' },
                    { code: '400', description: 'Bad request' },
                    { code: '401', description: 'Unauthorized' }
                ],
                icon: 'plus-circle'
            }
        ],
        'SDKs': [
            {
                id: 'sdk-javascript',
                title: 'JavaScript SDK',
                description: 'Documentation for the JavaScript SDK',
                icon: 'code'
            },
            {
                id: 'sdk-python',
                title: 'Python SDK',
                description: 'Documentation for the Python SDK',
                icon: 'code'
            },
            {
                id: 'sdk-php',
                title: 'PHP SDK',
                description: 'Documentation for the PHP SDK',
                icon: 'code'
            }
        ]
    };

    // Filter endpoints based on search query
    const filteredEndpoints = searchQuery 
        ? Object.values(apiEndpoints).flat().filter(endpoint => 
            endpoint.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            endpoint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (endpoint as any).endpoint?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : apiEndpoints[activeCategory as keyof typeof apiEndpoints];

    // Toggle endpoint expansion
    const toggleEndpoint = (id: string) => {
        if (expandedEndpoint === id) {
            setExpandedEndpoint(null);
        } else {
            setExpandedEndpoint(id);
        }
    };

    // Method badge color
    const getMethodColor = (method: string) => {
        switch (method) {
            case 'GET': return 'bg-green-100 text-green-800';
            case 'POST': return 'bg-blue-100 text-blue-800';
            case 'PUT': return 'bg-yellow-100 text-yellow-800';
            case 'DELETE': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

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
                        API Reference
                    </h1>
                    <p className="text-xl text-brand-gray-600 max-w-3xl mx-auto mb-10">
                        Complete reference documentation for the Kytriq API.
                    </p>

                    {/* Search bar */}
                    <div className="max-w-2xl mx-auto relative">
                        <div className="flex items-center border-2 border-brand-gray-200 rounded-full overflow-hidden bg-white shadow-sm focus-within:shadow-lg focus-within:border-techflex-blue transition-all duration-300">
                            <Icon name="search" className="w-5 h-5 text-brand-gray-400 ml-4" />
                            <input
                                type="text"
                                placeholder="Search API endpoints..."
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
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    {!searchQuery && (
                        <div className="lg:w-64 flex-shrink-0">
                            <div className="sticky top-24">
                                <h3 className="text-sm font-bold uppercase text-brand-gray-500 mb-4">API Reference</h3>
                                <nav className="space-y-1">
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => setActiveCategory(category)}
                                            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                                activeCategory === category
                                                    ? 'bg-techflex-blue text-white shadow-sm'
                                                    : 'text-brand-gray-600 hover:bg-brand-gray-100'
                                            }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </nav>

                                {/* API Version */}
                                <div className="mt-8 p-4 bg-brand-gray-100 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium text-brand-gray-500">CURRENT VERSION</span>
                                        <span className="text-xs bg-techflex-blue/10 text-techflex-blue px-2 py-1 rounded-full">
                                            v2.4.0
                                        </span>
                                    </div>
                                    <div className="text-sm text-brand-gray-600">
                                        <p className="mb-2">Released: June 15, 2023</p>
                                        <a href="#" className="text-techflex-blue hover:underline text-xs flex items-center">
                                            <Icon name="clock" className="w-3 h-3 mr-1" />
                                            View changelog
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main content */}
                    <div className="flex-1">
                        {/* Title for current category */}
                        {!searchQuery && (
                            <h2 className="text-2xl font-bold text-brand-gray-900 mb-6">
                                {activeCategory}
                            </h2>
                        )}

                        {/* Search results title */}
                        {searchQuery && (
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-brand-gray-900">
                                    Search Results
                                </h2>
                                <p className="text-brand-gray-600">
                                    Found {filteredEndpoints.length} results for "{searchQuery}"
                                </p>
                            </div>
                        )}

                        {/* API endpoints */}
                        <div className="space-y-6">
                            {filteredEndpoints.map((endpoint) => {
                                const hasDetails = 'method' in endpoint;
                                const isExpanded = expandedEndpoint === endpoint.id;

                                return (
                                    <div 
                                        key={endpoint.id}
                                        className="bg-white rounded-xl shadow-sm border border-brand-gray-100 overflow-hidden transition-all duration-300"
                                    >
                                        {/* Header */}
                                        <div 
                                            className={`p-6 cursor-pointer ${hasDetails ? 'hover:bg-brand-gray-50' : ''}`}
                                            onClick={() => hasDetails && toggleEndpoint(endpoint.id)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start">
                                                    {hasDetails && (
                                                        <span className={`px-2 py-1 rounded-md text-xs font-bold mr-3 ${getMethodColor((endpoint as any).method)}`}>
                                                            {(endpoint as any).method}
                                                        </span>
                                                    )}
                                                    <div>
                                                        <h3 className="font-medium text-brand-gray-900">
                                                            {endpoint.title}
                                                        </h3>
                                                        <p className="text-sm text-brand-gray-600 mt-1">
                                                            {endpoint.description}
                                                        </p>
                                                    </div>
                                                </div>
                                                {hasDetails && (
                                                    <Icon 
                                                        name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                                                        className="w-5 h-5 text-brand-gray-400 transition-transform duration-300"
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        {/* Expanded details */}
                                        {hasDetails && isExpanded && (
                                            <div className="px-6 pb-6 border-t border-brand-gray-100 pt-4">
                                                {/* Endpoint */}
                                                <div className="mb-6">
                                                    <h4 className="text-xs font-bold uppercase text-brand-gray-500 mb-2">
                                                        Endpoint
                                                    </h4>
                                                    <div className="bg-brand-gray-100 p-3 rounded-lg font-mono text-sm overflow-x-auto">
                                                        {(endpoint as any).endpoint}
                                                    </div>
                                                </div>

                                                {/* Parameters */}
                                                {(endpoint as any).parameters && (endpoint as any).parameters.length > 0 && (
                                                    <div className="mb-6">
                                                        <h4 className="text-xs font-bold uppercase text-brand-gray-500 mb-2">
                                                            Parameters
                                                        </h4>
                                                        <div className="overflow-x-auto">
                                                            <table className="min-w-full divide-y divide-brand-gray-200">
                                                                <thead>
                                                                    <tr>
                                                                        <th className="px-3 py-2 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                                                                            Name
                                                                        </th>
                                                                        <th className="px-3 py-2 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                                                                            Type
                                                                        </th>
                                                                        <th className="px-3 py-2 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                                                                            Description
                                                                        </th>
                                                                        <th className="px-3 py-2 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                                                                            Required
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="bg-white divide-y divide-brand-gray-200">
                                                                    {(endpoint as any).parameters.map((param: any, index: number) => (
                                                                        <tr key={index} className="text-sm">
                                                                            <td className="px-3 py-2 whitespace-nowrap font-medium text-brand-gray-900">
                                                                                {param.name}
                                                                            </td>
                                                                            <td className="px-3 py-2 whitespace-nowrap text-brand-gray-600">
                                                                                <code className="bg-brand-gray-100 px-1 py-0.5 rounded text-xs">
                                                                                    {param.type}
                                                                                </code>
                                                                            </td>
                                                                            <td className="px-3 py-2 text-brand-gray-600">
                                                                                {param.description}
                                                                            </td>
                                                                            <td className="px-3 py-2 whitespace-nowrap">
                                                                                {param.required ? (
                                                                                    <span className="text-red-600 text-xs">Required</span>
                                                                                ) : (
                                                                                    <span className="text-brand-gray-400 text-xs">Optional</span>
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Responses */}
                                                {(endpoint as any).responses && (endpoint as any).responses.length > 0 && (
                                                    <div>
                                                        <h4 className="text-xs font-bold uppercase text-brand-gray-500 mb-2">
                                                            Responses
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {(endpoint as any).responses.map((response: any, index: number) => (
                                                                <div key={index} className="flex items-center">
                                                                    <span className={`px-2 py-1 rounded-md text-xs font-bold mr-3 ${
                                                                        response.code.startsWith('2') ? 'bg-green-100 text-green-800' :
                                                                        response.code.startsWith('4') ? 'bg-red-100 text-red-800' :
                                                                        'bg-yellow-100 text-yellow-800'
                                                                    }`}>
                                                                        {response.code}
                                                                    </span>
                                                                    <span className="text-sm text-brand-gray-600">
                                                                        {response.description}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* SDK section */}
                <div className="mt-20 bg-gradient-to-r from-techflex-blue/10 to-techflex-orange/10 rounded-2xl p-8 border border-white">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-brand-gray-900 mb-2">
                            Official SDKs
                        </h2>
                        <p className="text-brand-gray-600">
                            Use our official SDKs to integrate with the Kytriq API quickly and easily.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="flex items-center mb-4">
                                <div className="bg-yellow-100 p-3 rounded-lg mr-3">
                                    <Icon name="code" className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-brand-gray-900">JavaScript</h3>
                                    <p className="text-xs text-brand-gray-500">v2.4.0</p>
                                </div>
                            </div>
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-sm">
                                    <Icon name="github" className="w-4 h-4 text-brand-gray-500 mr-2" />
                                    <span className="text-brand-gray-600">kytriq/kytriq-js</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <Icon name="package" className="w-4 h-4 text-brand-gray-500 mr-2" />
                                    <span className="text-brand-gray-600">npm install @kytriq/api</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => onNavigate && onNavigate('api', 'sdk-javascript')}
                                className="w-full py-2 bg-brand-gray-100 hover:bg-brand-gray-200 rounded-lg text-sm font-medium text-brand-gray-800 transition-colors duration-300"
                            >
                                View Documentation
                            </button>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-100 p-3 rounded-lg mr-3">
                                    <Icon name="code" className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-brand-gray-900">Python</h3>
                                    <p className="text-xs text-brand-gray-500">v2.4.0</p>
                                </div>
                            </div>
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-sm">
                                    <Icon name="github" className="w-4 h-4 text-brand-gray-500 mr-2" />
                                    <span className="text-brand-gray-600">kytriq/kytriq-python</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <Icon name="package" className="w-4 h-4 text-brand-gray-500 mr-2" />
                                    <span className="text-brand-gray-600">pip install kytriq</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => onNavigate && onNavigate('api', 'sdk-python')}
                                className="w-full py-2 bg-brand-gray-100 hover:bg-brand-gray-200 rounded-lg text-sm font-medium text-brand-gray-800 transition-colors duration-300"
                            >
                                View Documentation
                            </button>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="flex items-center mb-4">
                                <div className="bg-purple-100 p-3 rounded-lg mr-3">
                                    <Icon name="code" className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-brand-gray-900">PHP</h3>
                                    <p className="text-xs text-brand-gray-500">v2.4.0</p>
                                </div>
                            </div>
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-sm">
                                    <Icon name="github" className="w-4 h-4 text-brand-gray-500 mr-2" />
                                    <span className="text-brand-gray-600">kytriq/kytriq-php</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <Icon name="package" className="w-4 h-4 text-brand-gray-500 mr-2" />
                                    <span className="text-brand-gray-600">composer require kytriq/api</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => onNavigate && onNavigate('api', 'sdk-php')}
                                className="w-full py-2 bg-brand-gray-100 hover:bg-brand-gray-200 rounded-lg text-sm font-medium text-brand-gray-800 transition-colors duration-300"
                            >
                                View Documentation
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ApiReferencePage;
