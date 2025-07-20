
import React from 'react';
import { SoftwareProduct } from '../data/software';
import Icon from '../components/Icon';

interface SoftwareDetailPageProps {
    software: SoftwareProduct;
    onNavigate: (page: string, id?: string) => void;
}

const SoftwareDetailPage: React.FC<SoftwareDetailPageProps> = ({ software, onNavigate }) => {

    const handleBackClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onNavigate('software');
    };

    const handleGetStartedClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onNavigate('softwareGetStarted', software.id);
    };

    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                {/* Back Button */}
                <div className="mb-8">
                    <button
                        onClick={handleBackClick}
                        className="flex items-center text-sm font-semibold text-brand-gray-600 hover:text-techflex-blue transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        Back to all software
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                    {/* Left Column: Image */}
                    <div className="rounded-2xl overflow-hidden shadow-xl">
                        <img src={software.imageUrl} alt={software.name} className="w-full h-auto object-cover" />
                    </div>

                    {/* Right Column: Details */}
                    <div>
                        <span className="inline-block bg-techflex-blue-100 text-techflex-blue-800 text-sm font-semibold px-3 py-1 rounded-full mb-3">{software.category}</span>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-gray-900 tracking-tight">{software.name}</h1>
                        <p className="mt-4 text-lg text-brand-gray-600">{software.description}</p>
                        
                        <div className="mt-10 pt-8 border-t border-brand-gray-200">
                             <h3 className="text-xl font-bold text-brand-gray-800">What you get:</h3>
                             <ul className="mt-6 space-y-4">
                                {software.features.map((feature, index) => (
                                    <li key={index} className="flex items-start">
                                        <Icon name="check" className="h-6 w-6 text-techflex-orange mt-0.5 flex-shrink-0" />
                                        <span className="ml-3 text-base text-brand-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-10 p-6 bg-brand-gray-50 rounded-2xl border border-brand-gray-200">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div>
                                    <p className="text-sm font-medium text-brand-gray-500">Price</p>
                                    <p>
                                        <span className="text-4xl font-extrabold text-brand-gray-900">${software.price.toLocaleString()}</span>
                                        <span className="ml-1 text-base text-brand-gray-500">
                                            {software.pricingModel === 'Subscription' ? '/month' : ' one-time purchase'}
                                        </span>
                                    </p>
                                </div>
                                <button
                                    onClick={handleGetStartedClick}
                                    className="w-full sm:w-auto text-center bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    Get Started
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SoftwareDetailPage;
