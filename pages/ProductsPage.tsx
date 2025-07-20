
import React, { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { useContent } from '../contexts/ContentContext';

interface ProductsPageProps {
    onNavigate: (page: string, id?: string) => void;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ onNavigate }) => {
    const { products } = useContent();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.category)))], [products]);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [searchTerm, activeCategory, products]);

    return (
        <div className="bg-brand-gray-50">
            {/* Page Header */}
            <div className="bg-brand-gray-100 py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-brand-gray-900 tracking-tight">Our Gadgets & Electronics</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-gray-600">
                        Discover the latest in technology, from powerful laptops to innovative accessories, all designed to enhance your digital life.
                    </p>
                </div>
            </div>

            {/* Filters and Product Grid */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Filter Bar */}
                <div className="mb-12">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-1/3">
                             <span className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                             </span>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-brand-gray-300 rounded-lg focus:ring-techflex-orange focus:border-techflex-orange"
                                aria-label="Search products"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center" role="group" aria-label="Product categories">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200 ${
                                        activeCategory === category
                                            ? 'bg-techflex-blue text-white shadow'
                                            : 'bg-white text-brand-gray-700 hover:bg-brand-gray-200'
                                    }`}
                                    aria-pressed={activeCategory === category}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                {filteredProducts.length > 0 ? (
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 border-2 border-dashed border-brand-gray-200 rounded-2xl">
                        <h3 className="text-2xl font-semibold text-brand-gray-700">No products found</h3>
                        <p className="mt-2 text-brand-gray-500">Try adjusting your search or filter criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;
