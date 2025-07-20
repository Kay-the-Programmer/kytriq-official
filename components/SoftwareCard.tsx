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
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 group flex flex-col border border-brand-gray-200">
      <div className="p-6">
        <div className="flex items-center gap-4">
            {software.logoUrl && (
                <div className="bg-techflex-blue-100 p-3 rounded-lg">
                    <Icon name={software.logoUrl} className="h-8 w-8 text-techflex-blue" />
                </div>
            )}
            <div>
                 <h3 className="text-xl font-bold text-brand-gray-900 group-hover:text-techflex-blue transition-colors duration-300">{software.name}</h3>
                 <span className="text-sm font-semibold text-techflex-blue-600">{software.category}</span>
            </div>
        </div>
        <p className="mt-4 text-brand-gray-600 text-sm h-20">{software.description}</p>
      </div>

      <div className="px-6 pt-4 pb-6 bg-brand-gray-50 flex-grow flex flex-col justify-between">
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

        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
              <p>
                <span className="text-2xl font-extrabold text-brand-gray-900">${software.price.toLocaleString()}</span>
                <span className="text-sm text-brand-gray-500">
                    {software.pricingModel === 'Subscription' ? '/month' : ' one-time'}
                </span>
              </p>
          </div>
          <a href="#" onClick={handleLearnMore} className="w-full text-center block bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300">
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
};

export default SoftwareCard;