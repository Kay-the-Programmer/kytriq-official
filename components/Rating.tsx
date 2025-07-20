
import React from 'react';
import Icon from './Icon';

interface RatingProps {
    rating: number;
    reviewCount: number;
    className?: string;
}

const Rating: React.FC<RatingProps> = ({ rating, reviewCount, className }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Icon key={i} name="star" className={`w-5 h-5 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-brand-gray-300'}`} />
        ))}
      </div>
      {reviewCount > 0 ? (
        <p className="ml-2 text-sm text-brand-gray-500">{rating.toFixed(1)} ({reviewCount} reviews)</p>
      ) : (
        <p className="ml-2 text-sm text-brand-gray-500">{rating.toFixed(1)}</p>
      )}
    </div>
  );
};

export default Rating;