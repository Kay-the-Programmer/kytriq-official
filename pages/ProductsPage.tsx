
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
    const prevScrollPos = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;
            const isScrollingDown = prevScrollPos.current < currentScrollPos;

            // Use the same logic as in the Header component
            setIsHeaderVisible(!isScrollingDown || currentScrollPos < 10);
            prevScrollPos.current = currentScrollPos;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
            <div className="flex flex-col lg:flex-row overflow-hidden shadow-md h-[90vh]">
                {/* Left: Image with no spacing  */}

                <div className="w-full lg:w-2/3 h-64 lg:h-full">
                    <img
                        src="/images/gadgets.png"
                        alt="SnapCart"
                        className="w-full h-full object-cover"
                    />
                </div>


                {/* Right:  Text content */}
                <div className="w-full lg:w-1/3 p-6 sm:p-8 flex flex-col justify-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-brand-gray-900 tracking-tight">Shop
                        Gadgets & Accessories</h1>
                    <p className="mt-4 text-sm sm:text-base text-brand-gray-600">
                        Discover the latest in technology, from powerful laptops to innovative accessories, all
                        designed to enhance your digital life.
                    </p>

                </div>

            </div>


            {/* Filter Bar - Full Width */}
            <div className={`sticky ${isHeaderVisible ? 'top-16' : 'top-0'} bg-brand-gray-50 z-40 py-4 transition-all duration-300 border-b border-brand-gray-200 shadow-sm`}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-1/3">
                             <span className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path
                                    strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                             </span>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-brand-gray-300 rounded-full focus:ring-techflex-blue focus:border-techflex-blue"
                                aria-label="Search products"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center" role="group"
                             aria-label="Product categories">
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
            </div>

            {/* Products Section */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Product Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map((product, index) => (
                            <ProductCard key={product.id || `product-${index}`} product={product} onNavigate={onNavigate}/>
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
