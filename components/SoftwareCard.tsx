import React, { memo, useCallback } from 'react';
import Icon from './Icon';

interface SoftwareCardProps {
    software: {
        id: string;
        name: string;
        description: string;
        category: string;
        price?: number;
        imageUrl?: string;
    };
    onNavigate: (page: string, id: string) => void;
}

const SoftwareCard: React.FC<SoftwareCardProps> = ({ software, onNavigate }) => {
    // Memoized navigation handler
    const handleViewDetails = useCallback(() => {
        onNavigate('softwareDetail', software.id);
    }, [software.id, onNavigate]);

    return (
        <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 transform-gpu">
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img 
                    src={software.imageUrl || '/images/software-placeholder.jpg'} 
                    alt={software.name}
                    className="w-full h-44 object-cover transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy" // Add lazy loading for images
                />
            </div>
            <div className="p-5">
                <div className="flex items-center mb-2">
                    <span className="text-xs font-medium text-brand-gray-500 bg-brand-gray-100 px-2 py-0.5 rounded">
                        {software.category}
                    </span>
                    <div className="ml-auto flex items-center">
                        <Icon name="star" className="h-4 w-4 text-yellow-400" />
                    </div>
                </div>
                <h3 className="text-lg font-bold text-brand-gray-800 mb-2 group-hover:text-techflex-blue transition-colors duration-300">
                    {software.name}
                </h3>
                <p className="text-sm text-brand-gray-600 mb-4 line-clamp-2">
                    {software.description}
                </p>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-brand-gray-100">
                    <span className="text-sm font-medium text-brand-gray-900">
                        {software.price ? `$${software.price}` : 'Free Trial'}
                    </span>
                    <button
                        onClick={handleViewDetails}
                        className="inline-flex items-center text-sm font-medium text-techflex-blue hover:text-techflex-blue-600 transition-colors duration-300"
                    >
                        View Details
                        <Icon name="arrow-right" className="ml-1 h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(SoftwareCard);