import React from 'react';

// --- BusinessCard Component ---
// Now accepts optional props for a call-to-action button.
interface BusinessCardProps {
  imageUrl: string;
  title: string;
  description: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ imageUrl, title, description, buttonLabel, onButtonClick }) => (
    // Added flex utilities to ensure cards have equal height and buttons align at the bottom.
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group flex flex-col">
      <div className="overflow-hidden h-[300px] p-2">
      <div className="w-full h-full rounded-2xl overflow-hidden">
          <img src={imageUrl} alt={title}
               className="w-full h-full  object-cover group-hover:scale-110 transition-transform duration-500 rounded-2xl"/>
        </div>
      </div>
      {/* The content area now grows to fill available space, pushing the button to the bottom. */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-brand-gray-800">{title}</h3>
        {/* Description now grows to fill space, ensuring a consistent layout. */}
        <p className="mt-2 text-brand-gray-600 flex-grow">{description}</p>

        {/* Conditionally render the button if a label and action are provided. */}
        {buttonLabel && onButtonClick && (
            <div className="mt-auto pt-4">
              <button
                  onClick={onButtonClick}
                  className="inline-block bg-techflex-blue-500 hover:bg-techflex-blue-600 text-white font-bold py-2 px-5 rounded-xl transition-all duration-300"
              >
                {buttonLabel}
              </button>
            </div>
        )}
      </div>
    </div>
);


// --- BusinessSection Component ---
// Contains the data and layout for the section.
const BusinessSection: React.FC = () => {
  // Updated data to include a buttonLabel and onButtonClick action for each card.
  const businessSolutions = [
    {
      imageUrl: 'images/microfinance.jpg',
      title: 'Microfinance',
      description: 'A digital wallet and micro-loan management platform that helps individuals and small businesses manage payments, set savings goals, and access short-term credit.',
      buttonLabel: 'Learn More',
      onButtonClick: () => alert('Learn more about Digital Payments!'),
    },
    {
      imageUrl: 'images/file-tracking.png',
      title: 'Digital Document Tracking System',
      description: 'A web-based file and workflow management tool for government and private offices to digitize physical records, track file movement, and reduce paper clutter.',
      buttonLabel: 'Learn More',
      onButtonClick: () => alert('Explore our E-Commerce Platforms!'),
    },
    {
      imageUrl: 'images/delivery.png',
      title: 'Delivery Management System',
      description: 'A powerful platform for managing deliveries, pickups, and real-time courier tracking. SwiftFlex helps businesses streamline dispatching, optimize routes, and provide customers with live delivery updates — all from one easy-to-use dashboard.',
      buttonLabel: 'Learn More',
      onButtonClick: () => alert('Discover our Mobile Applications!'),
    },
  ];

  return (
      <section className="bg-brand-gray-50 py-8 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-brand-gray-900 mb-6 text-left">Our Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businessSolutions.map((solution) => (
                <BusinessCard key={solution.title} {...solution} />
            ))}
          </div>
        </div>
      </section>
  );
};

export default BusinessSection;