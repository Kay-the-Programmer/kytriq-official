
import React from 'react';
import Icon from '../components/Icon';
import { SoftwareProduct } from '../data/software';

interface SoftwareSetupConfirmationPageProps {
  software: SoftwareProduct | undefined;
  onNavigate: (page: string) => void;
}

const SoftwareSetupConfirmationPage: React.FC<SoftwareSetupConfirmationPageProps> = ({ software, onNavigate }) => {

    if (!software) {
        return (
             <div className="bg-brand-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                    <div className="max-w-2xl mx-auto text-center bg-white p-10 rounded-2xl shadow-xl">
                        <h1 className="mt-6 text-3xl md:text-4xl font-extrabold text-brand-gray-900 tracking-tight">Something went wrong</h1>
                         <p className="mt-4 text-lg text-brand-gray-600">
                            We couldn't find the software details. Please try again.
                        </p>
                        <button
                            onClick={() => onNavigate('software')}
                            className="mt-10 w-full sm:w-auto bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all"
                        >
                            Back to Software
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-brand-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                <div className="max-w-2xl mx-auto text-center bg-white p-10 rounded-2xl shadow-xl">
                    <Icon name="check-circle" className="h-16 w-16 mx-auto text-green-500"/>
                    <h1 className="mt-6 text-3xl md:text-4xl font-extrabold text-brand-gray-900 tracking-tight">Welcome to {software.name}!</h1>
                    <p className="mt-4 text-lg text-brand-gray-600">
                        Your setup is complete. You will receive an email shortly with instructions on how to access your new software.
                    </p>
                    
                    <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                         <button
                            onClick={() => onNavigate('account')}
                            className="w-full sm:w-auto bg-techflex-blue hover:bg-techflex-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all"
                        >
                            Go to My Account
                        </button>
                         <button
                            onClick={() => onNavigate('home')}
                            className="w-full sm:w-auto bg-brand-gray-200 hover:bg-brand-gray-300 text-brand-gray-800 font-bold py-3 px-8 rounded-lg text-lg transition-all"
                        >
                            Explore Site
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SoftwareSetupConfirmationPage;
