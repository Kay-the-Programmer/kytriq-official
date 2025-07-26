
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SoftwareProduct } from '../data/software';
import Icon from '../components/Icon';
import { useContent } from '../contexts/ContentContext';

const SoftwareDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { softwareProducts } = useContent();
    const [software, setSoftware] = useState<SoftwareProduct | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id && softwareProducts.length > 0) {
            const foundSoftware = softwareProducts.find(s => s.id === id);
            if (foundSoftware) {
                setSoftware(foundSoftware);
            }
            setLoading(false);
        }
    }, [id, softwareProducts]);

    const handleBackClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        navigate('/software');
    };

    const handleGetStartedClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (software) {
            navigate(`/software-get-started/${software.id}`);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16 flex justify-center items-center">
                <div className="text-center">
                    <Icon name="loading" className="h-12 w-12 mx-auto text-techflex-blue animate-spin" />
                    <p className="mt-4 text-lg text-brand-gray-600">Loading software details...</p>
                </div>
            </div>
        );
    }

    if (!software) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <Icon name="exclamation-circle" className="h-12 w-12 mx-auto text-red-500" />
                    <h2 className="mt-4 text-2xl font-bold text-brand-gray-900">Software Not Found</h2>
                    <p className="mt-2 text-lg text-brand-gray-600">The software you're looking for doesn't exist or has been removed.</p>
                    <button
                        onClick={() => navigate('/software')}
                        className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-techflex-blue hover:bg-techflex-blue-700"
                    >
                        Back to Software
                    </button>
                </div>
            </div>
        );
    }

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
