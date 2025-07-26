import React, { memo, useCallback } from 'react';
import Icon from './Icon';

interface SoftwareCardProps {
    software: {
        id: string;
        name: string;
        description: string;
        category: string;
        imageUrl: string;
        features: string[];
    };
    onNavigate: (page: string, id: string) => void;
}

const SoftwareCard: React.FC<SoftwareCardProps> = ({ software, onNavigate }) => {
    const handleClick = useCallback(() => {
        if (typeof onNavigate === 'function') {
            onNavigate('software', software.id);
        } else {
            console.error('onNavigate is not a function');
        }
    }, [software.id, onNavigate]);

    return (
        <div 
            className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden border border-brand-gray-100/50 hover:border-techflex-blue/20 transform hover:-translate-y-1"
            onClick={handleClick}
        >
            {/* Card image */}
            <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0 opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                <img
                    src={software.imageUrl || "/images/software-placeholder.png"}
                    alt={software.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />

                {/* Category badge */}
                <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-techflex-blue/80 text-white shadow-lg">
                        {software.category}
                    </span>
                </div>
            </div>

            {/* Card content */}
            <div className="p-6">
                <h3 className="text-lg font-bold text-brand-gray-800 mb-2 group-hover:text-techflex-blue transition-colors duration-300">
                    {software.name}
                </h3>
                <p className="text-brand-gray-600 text-sm mb-4 line-clamp-2">
                    {software.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {software.features && software.features.slice(0, 3).map((feature, idx) => (
                        <span 
                            key={idx}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-brand-gray-100 text-brand-gray-700"
                        >
                            <div className="w-1 h-1 bg-techflex-blue rounded-full mr-1.5"></div>
                            {feature}
                        </span>
                    ))}
                </div>

                {/* View details button */}
                <button 
                    className="group inline-flex items-center text-sm text-techflex-blue font-medium hover:text-techflex-blue-600 transition-colors duration-300"
                    onClick={handleClick}
                >
                    View details
                    <Icon name="arrow-right" className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
            </div>
        </div>
    );
};

export default memo(SoftwareCard);
