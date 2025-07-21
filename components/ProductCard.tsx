import React from 'react';
import { Product } from '../data/products';
import { useCart } from '../contexts/CartContext';
import Rating from './Rating';

interface ProductCardProps {
    product: Product;
    onNavigate: (page: string, id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();
      addToCart(product, 1);
  }

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      onNavigate('productDetail', product.id);
  };

  return (
    <div onClick={handleCardClick} className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 group overflow-hidden flex flex-col cursor-pointer">
      <div className="relative overflow-hidden">
        <img src={product.imageUrl} alt={product.name} className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500" />
        <span className="absolute top-4 left-4 bg-techflex-blue-100 text-techflex-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{product.category}</span>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-brand-gray-800 group-hover:text-techflex-blue transition-colors duration-300">{product.name}</h3>
        <div className="mt-2">
            <Rating rating={product.rating} reviewCount={product.reviewCount} />
        </div>
        <p className="mt-2 text-brand-gray-600 flex-grow text-sm line-clamp-2">{product.description}</p>
          <div className="mt-4 flex flex-col items-end gap-2">
              <p className="text-2xl font-extrabold text-brand-gray-900 w-full">${product.price.toLocaleString()}</p>
              <button onClick={handleAddToCart}
                      className="bg-techflex-blue-500 hover:bg-techflex-orange-600 text-white font-bold py-2 px-4 rounded-2xl transition-all duration-300 text-sm w-full">
                  Add to Cart
              </button>
          </div>
      </div>
    </div>
  );
};

export default ProductCard;