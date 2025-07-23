import React, { useState, useMemo, useEffect, useRef } from 'react';
import ProductCard from '../components/ProductCard';
import { useContent } from '../contexts/ContentContext';

interface ProductsPageProps {
    onNavigate: (page: string, id?: string) => void;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ onNavigate }) => {
    const { products } = useContent();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState('featured');
    const [filtersExpanded, setFiltersExpanded] = useState(false);
    const prevScrollPos = useRef(0);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;
            const isScrollingDown = prevScrollPos.current < currentScrollPos;
            setIsHeaderVisible(!isScrollingDown || currentScrollPos < 10);
            prevScrollPos.current = currentScrollPos;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const categories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.category)))], [products]);

    const filteredProducts = useMemo(() => {
        let filtered = products.filter(product => {
            const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        switch (sortBy) {
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            default:
                break;
        }

        return filtered;
    }, [searchTerm, activeCategory, sortBy, products]);

    const clearFilters = () => {
        setSearchTerm('');
        setActiveCategory('All');
        searchInputRef.current?.focus();
    };

    const hasActiveFilters = searchTerm || activeCategory !== 'All';

    return (
        <div className="min-h-screen bg-white">
            {/* Minimal Hero Section */}
            <div className="bg-white border-b border-brand-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    <div className="text-center max-w-2xl mx-auto">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-gray-900 mb-3">
                            Products
                        </h1>
                        <p className="text-base text-brand-gray-600 mb-6">
                            Discover our collection of premium technology products.
                        </p>

                        {/* Compact Stats */}
                        <div className="flex justify-center items-center gap-6 text-sm text-brand-gray-500">
                            <span>{products.length} Products</span>
                            <span>•</span>
                            <span>{categories.length - 1} Categories</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ultra Compact Sticky Filter Bar */}
            <div className={`sticky ${isHeaderVisible ? 'top-16' : 'top-0'} bg-white/95 backdrop-blur-sm z-40 border-b border-brand-gray-100 transition-all duration-300`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Main Filter Row - Always Visible */}
                    <div className="flex items-center gap-3 py-3">
                        {/* Compact Search */}
                        <div className="relative flex-1 max-w-sm">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-sm border border-brand-gray-200 rounded-lg focus:ring-1 focus:ring-techflex-blue focus:border-techflex-blue transition-colors bg-white"
                            />
                        </div>

                        {/* Active Category Indicator */}
                        {activeCategory !== 'All' && (
                            <div className="flex items-center gap-1 px-3 py-1.5 bg-techflex-blue/10 text-techflex-blue rounded-full text-sm font-medium">
                                <span>{activeCategory}</span>
                                <button
                                    onClick={() => setActiveCategory('All')}
                                    className="ml-1 hover:bg-techflex-blue/20 rounded-full p-0.5"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* Results Count */}
                        <span className="text-sm text-brand-gray-500 whitespace-nowrap">
                            {filteredProducts.length} found
                        </span>

                        {/* Compact Controls */}
                        <div className="flex items-center gap-2">
                            {/* Filter Toggle Button */}
                            <button
                                onClick={() => setFiltersExpanded(!filtersExpanded)}
                                className={`p-2 rounded-lg border border-brand-gray-200 hover:bg-brand-gray-50 transition-colors ${
                                    filtersExpanded ? 'bg-brand-gray-100' : ''
                                }`}
                                title="Filters"
                            >
                                <svg className="w-4 h-4 text-brand-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                                </svg>
                            </button>

                            {/* Sort */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="text-sm border border-brand-gray-200 rounded-lg px-2 py-1.5 bg-white focus:ring-1 focus:ring-techflex-blue focus:border-techflex-blue"
                            >
                                <option value="featured">Featured</option>
                                <option value="name">Name</option>
                                <option value="price-low">Price ↑</option>
                                <option value="price-high">Price ↓</option>
                            </select>

                            {/* View Toggle */}
                            <div className="flex border border-brand-gray-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 transition-colors ${
                                        viewMode === 'grid'
                                            ? 'bg-techflex-blue text-white'
                                            : 'text-brand-gray-400 hover:text-brand-gray-600 hover:bg-brand-gray-50'
                                    }`}
                                    title="Grid view"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 transition-colors ${
                                        viewMode === 'list'
                                            ? 'bg-techflex-blue text-white'
                                            : 'text-brand-gray-400 hover:text-brand-gray-600 hover:bg-brand-gray-50'
                                    }`}
                                    title="List view"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Expandable Categories Row */}
                    {filtersExpanded && (
                        <div className="pb-3 border-t border-brand-gray-100">
                            <div className="flex flex-wrap gap-2 mt-3">
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setActiveCategory(category)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                            activeCategory === category
                                                ? 'bg-techflex-blue text-white'
                                                : 'bg-brand-gray-100 text-brand-gray-700 hover:bg-brand-gray-200'
                                        }`}
                                    >
                                        {category}
                                    </button>
                                ))}

                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="px-3 py-1.5 rounded-full text-xs font-medium text-techflex-blue hover:bg-techflex-blue/10 transition-colors ml-2"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {filteredProducts.length > 0 ? (
                    <div className={`grid gap-6 ${
                        viewMode === 'grid'
                            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                            : 'grid-cols-1 max-w-4xl mx-auto'
                    }`}>
                        {filteredProducts.map((product, index) => (
                            <ProductCard
                                key={product.id || `product-${index}`}
                                product={product}
                                onNavigate={onNavigate}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 mx-auto mb-4 bg-brand-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-brand-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-brand-gray-900 mb-2">
                            No products found
                        </h3>
                        <p className="text-brand-gray-600 mb-4 max-w-md mx-auto">
                            Try adjusting your search or filters.
                        </p>
                        <button
                            onClick={clearFilters}
                            className="bg-techflex-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-techflex-blue-600 transition-colors"
                        >
                            Show all products
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;