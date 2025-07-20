
import React from 'react';
import Icon from './Icon';

interface FeatureCardProps {
  iconName: string;
  title: string;
  onClick: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ iconName, title, onClick }) => {
  return (
    <div onClick={onClick} className="flex  flex-col items-center text-center group cursor-pointer">
      <div className="bg-techflex-blue-100 p-6 rounded-3xl mb-4 transition-transform duration-300 group-hover:-translate-y-2">
        <Icon name={iconName} className="h-10 w-10 text-techflex-blue" />
      </div>
      <p className="font-semibold text-brand-gray-700 max-w-[150px]">{title}</p>
    </div>
  );
};

interface FeaturesProps {
    onNavigate: (page: string) => void;
}

const Features: React.FC<FeaturesProps> = ({ onNavigate }) => {
  const featuresData = [
    { iconName: 'cart', title: 'Shop for accessories', page: 'products' },
    { iconName: 'code', title: 'Let\'s build your software', page: 'software-development' },
    { iconName: 'briefcase', title: 'Find software for your business', page: 'software' },
    { iconName: 'compass', title: 'Discover our products', page: 'products' },
  ];

  return (
    <div className="container  mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
        {featuresData.map((feature) => (
          <FeatureCard 
            key={feature.title} 
            iconName={feature.iconName} 
            title={feature.title} 
            onClick={() => onNavigate(feature.page)} 
          />
        ))}
      </div>
    </div>
  );
};

export default Features;
