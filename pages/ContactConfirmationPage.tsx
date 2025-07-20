
import React from 'react';
import Icon from '../components/Icon';

interface ContactConfirmationPageProps {
  onNavigate: (page: string) => void;
}

const ContactConfirmationPage: React.FC<ContactConfirmationPageProps> = ({ onNavigate }) => {

    return (
        <div className="bg-brand-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                <div className="max-w-2xl mx-auto text-center bg-white p-10 rounded-2xl shadow-xl">
                    <Icon name="check-circle" className="h-16 w-16 mx-auto text-green-500"/>
                    <h1 className="mt-6 text-3xl md:text-4xl font-extrabold text-brand-gray-900 tracking-tight">Message Sent!</h1>
                    <p className="mt-4 text-lg text-brand-gray-600">
                        Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.
                    </p>
                    
                    <div className="mt-10">
                         <button
                            onClick={() => onNavigate('home')}
                            className="w-full sm:w-auto bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all"
                        >
                            Return to Homepage
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactConfirmationPage;
