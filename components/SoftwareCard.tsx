import React from 'react';
import { SoftwareProduct } from '../data/software';
import Icon from './Icon';

interface SoftwareCardProps {
    software: SoftwareProduct;
    onNavigate: (page: string, id: string) => void;
}

const SoftwareCard: React.FC<SoftwareCardProps> = ({ software, onNavigate }) => {

    const handleLearnMore = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        onNavigate('softwareDetail', software.id);
    };

    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group flex flex-col border border-brand-gray-200">
            {/* Image Section */}
            {software.logoUrl && (
                <div className="w-full bg-white flex justify-center items-center p-4">
                    <img
                        src={software.logoUrl}
                        alt={software.name}
                        className="max-h-32 sm:max-h-28 md:max-h-32 w-auto object-contain"
                    />
                </div>
            )}

            {/* Content Section */}
            <div className="px-4 sm:px-6 py-4 bg-brand-gray-50 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-brand-gray-900 group-hover:text-techflex-blue transition-colors duration-300">
                        {software.name}
                    </h3>
                    <span className="inline-block px-3 py-1 rounded-full bg-techflex-blue-100 text-sm font-medium text-techflex-blue-600">
                    {software.category}
                </span>
                </div>
                <p className="mt-4 sm:mt-6 text-brand-gray-600 text-sm sm:text-base leading-relaxed line-clamp-3">
                    {software.description}
                </p>
            </div>

            {/* Features and Pricing Section */}
            <div className="px-4 sm:px-6 pt-4 pb-6 bg-brand-gray-50 flex-grow flex flex-col justify-between">
                <div>
                    <h4 className="text-sm font-semibold text-brand-gray-700 mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                        {software.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                                <Icon name="check" className="h-5 w-5 text-techflex-orange mt-0.5 flex-shrink-0" />
                                <span className="ml-2 text-sm text-brand-gray-600">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Pricing and CTA */}
                <div className="mt-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                        <p>
                        <span className="text-xl sm:text-2xl font-extrabold text-brand-gray-900">
                            ${software.price.toLocaleString()}
                        </span>
                            <span className="text-sm text-brand-gray-500 ml-1">
                            {software.pricingModel === 'Subscription' ? '/month' : ' one-time'}
                        </span>
                        </p>
                    </div>
                    <a
                        href="#"
                        onClick={handleLearnMore}
                        className="w-full text-center block bg-techflex-blue-500 hover:bg-techflex-blue-600 text-white font-bold py-3 px-4 rounded-full transition-all duration-300"
                    >
                        Learn More
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SoftwareCard;
