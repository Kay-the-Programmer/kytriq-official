import React, { useState } from 'react';
import { Product } from '../data/products';
import { useCart } from '../contexts/CartContext';
import Icon from '../components/Icon';
import Rating from '../components/Rating';

interface ProductDetailPageProps {
    product: Product;
    onNavigate: (page: string, id?: string) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onNavigate }) => {
    const { addToCart } = useCart();

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(product.colors ? product.colors[0] : null);
    const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : null);
    const [activeTab, setActiveTab] = useState('Description');

    const handleBackClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onNavigate('products');
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
    };

    const nextImage = () => {
        setSelectedImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
    };

    const prevImage = () => {
        setSelectedImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
    };

    const calculateDiscount = () => {
        if (product.originalPrice && product.price < product.originalPrice) {
            return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        }
        return 0;
    };
    const discount = calculateDiscount();

    if (!product) {
        return (
            <div className="bg-brand-gray-50 text-center py-24">
                <h2 className="text-2xl font-bold">Product not found</h2>
                <button onClick={() => onNavigate('products')} className="mt-4 bg-techflex-orange text-white font-bold py-2 px-4 rounded-lg">
                    Back to Products
                </button>
            </div>
        );
    }

    const renderMarkdown = (text: string) => {
        return text.split('\n').map((line, index) => {
            if (line.startsWith('**') && line.endsWith('**')) {
                return <p key={index} className="font-bold mt-2 text-brand-gray-800">{line.slice(2, -2)}</p>;
            }
            if (line.startsWith('- ')) {
                return <li key={index} className="list-disc list-inside">{line.slice(2)}</li>;
            }
            return <p key={index} className="my-1">{line}</p>;
        });
    };

    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <div className="text-sm text-brand-gray-500 mb-6">
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home')}} className="hover:text-brand-gray-800">Home</a>
                    <span className="mx-2">/</span>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('products')}} className="hover:text-brand-gray-800">Products</a>
                    <span className="mx-2">/</span>
                    <span className="text-brand-gray-900 font-medium">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Image Gallery */}
                    <div className="lg:col-span-7 flex gap-4">
                        <div className="flex flex-col gap-2.5">
                            {product.images.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`${product.name} thumbnail ${index + 1}`}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`w-20 h-24 object-cover rounded-lg cursor-pointer border-2 ${selectedImageIndex === index ? 'border-techflex-blue' : 'border-transparent'} hover:border-techflex-blue/50 transition`}
                                />
                            ))}
                        </div>
                        <div className="relative flex-1">
                            <img src={product.images[selectedImageIndex]} alt={product.name} className="w-full h-full object-cover rounded-2xl" />
                            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition shadow-md">
                                <Icon name="chevron-left" className="w-6 h-6" />
                            </button>
                             <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition shadow-md">
                                <Icon name="chevron-right" className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="lg:col-span-5">
                        <h1 className="text-3xl md:text-4xl font-bold text-brand-gray-900 tracking-tight">{product.name}</h1>
                        <div className="mt-3 flex flex-wrap gap-2 items-center">
                            {product.tags?.includes('Best Seller') && <span className="flex items-center gap-1.5 text-sm font-semibold text-techflex-blue bg-techflex-blue-50 px-3 py-1 rounded-full"><Icon name="tag" className="w-4 h-4" /> Best Seller</span>}
                            {product.tags?.includes('Selling Fast') && <span className="flex items-center gap-1.5 text-sm font-semibold text-techflex-orange-700 bg-techflex-orange-50 px-3 py-1 rounded-full"><Icon name="fire" className="w-4 h-4" /> Selling Fast</span>}
                        </div>

                        <div className="mt-4">
                            <Rating rating={product.rating} reviewCount={product.reviewCount} />
                        </div>

                        <div className="mt-5 flex items-baseline gap-3">
                            <p className="text-3xl font-bold text-brand-gray-900">${product.price.toFixed(2)}</p>
                            {product.originalPrice && <p className="text-xl text-brand-gray-400 line-through">${product.originalPrice.toFixed(2)}</p>}
                            {discount > 0 && <p className="bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-md text-sm">{discount}% OFF</p>}
                        </div>

                        {product.stockStatus === 'In Stock' && <div className="mt-2 flex items-center gap-2 text-sm text-green-600"><Icon name="check-circle" className="w-4 h-4" />In Stock</div>}
                        <div className="mt-2 flex items-center gap-2 text-sm text-brand-gray-500"><Icon name="eye" className="w-4 h-4" />{Math.floor(Math.random()*50) + 10} people are viewing this right now</div>

                        {product.colors && (
                            <div className="mt-6">
                                <h3 className="text-sm font-medium text-brand-gray-900">Color: <span className="font-bold">{selectedColor?.name}</span></h3>
                                <div className="flex gap-2 mt-2">
                                    {product.colors.map(color => (
                                        <button key={color.name} onClick={() => setSelectedColor(color)} className={`w-8 h-8 rounded-full border-2 ${selectedColor?.name === color.name ? 'border-techflex-blue' : 'border-transparent'} transition`}>
                                            <div className={`w-full h-full rounded-full border-2 border-white ${color.class}`}></div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.sizes && (
                            <div className="mt-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-medium text-brand-gray-900">Size: <span className="font-bold">{selectedSize}</span></h3>
                                    <a href="#" className="text-sm font-medium text-techflex-blue hover:underline">Find your size</a>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {product.sizes.map(size => (
                                        <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${selectedSize === size ? 'bg-brand-gray-900 text-white border-brand-gray-900' : 'bg-white hover:bg-brand-gray-100 border-brand-gray-300'}`}>{size}</button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center justify-between border border-brand-gray-300 rounded-lg py-2 px-4 md:col-span-1">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-brand-gray-500 hover:text-brand-gray-900"><Icon name="minus" className="w-5 h-5"/></button>
                                <span className="font-bold text-lg">{quantity}</span>
                                <button onClick={() => setQuantity(q => q + 1)} className="text-brand-gray-500 hover:text-brand-gray-900"><Icon name="plus" className="w-5 h-5"/></button>
                            </div>
                            <button onClick={handleAddToCart} className="w-full md:col-span-2 flex items-center justify-center bg-brand-gray-900 hover:bg-black text-white font-bold py-3 px-8 rounded-lg text-base transition">
                                <Icon name="cart" className="h-5 w-5 mr-2" />
                                Add to Cart
                            </button>
                        </div>

                        <div className="mt-6 border-t pt-6 space-y-4">
                           <div className="flex items-center gap-3"><Icon name="truck" className="w-6 h-6 text-techflex-blue" /><p className="text-sm text-brand-gray-600">Free shipping on orders over $50</p></div>
                           <div className="flex items-center gap-3"><Icon name="refresh" className="w-6 h-6 text-techflex-blue" /><p className="text-sm text-brand-gray-600">30-day easy returns</p></div>
                           <div className="flex items-center gap-3"><Icon name="shield-check" className="w-6 h-6 text-techflex-blue" /><p className="text-sm text-brand-gray-600">Guaranteed secure checkout</p></div>
                        </div>

                    </div>
                </div>

                {/* Bottom Section: Tabs */}
                <div className="mt-16 pt-8 border-t">
                    <div className="border-b border-brand-gray-200">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            {['Description', 'Additional Information', 'Reviews'].map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab ? 'border-techflex-blue text-techflex-blue' : 'border-transparent text-brand-gray-500 hover:text-brand-gray-700 hover:border-brand-gray-300'}`}>
                                    {tab} {tab === 'Reviews' && `(${product.details?.reviews.length || 0})`}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="py-6 text-brand-gray-600 text-sm leading-relaxed">
                        {activeTab === 'Description' && <div>{renderMarkdown(product.description || '')}</div>}
                        {activeTab === 'Additional Information' && <ul className="space-y-2">{product.details?.additionalInfo.map((info, i) => <li key={i} className="list-disc list-inside">{renderMarkdown(info)}</li>)}</ul>}
                        {activeTab === 'Reviews' && (
                             <div className="space-y-6">
                                {product.details?.reviews.map((review, i) => (
                                    <div key={i} className="border-b border-brand-gray-100 pb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-techflex-blue-100 flex items-center justify-center font-bold text-techflex-blue-600">{review.author.charAt(0)}</div>
                                            <div>
                                                <p className="font-bold text-brand-gray-900">{review.author}</p>
                                                <Rating rating={review.rating} reviewCount={0} />
                                            </div>
                                        </div>
                                        <p className="mt-3">{review.text}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
