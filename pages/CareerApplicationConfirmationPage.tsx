
import React from 'react';
import Icon from '../components/Icon';
import { JobOpening } from '../data/careers';

interface CareerApplicationConfirmationPageProps {
  job: JobOpening | undefined;
  onNavigate: (page: string) => void;
}

const CareerApplicationConfirmationPage: React.FC<CareerApplicationConfirmationPageProps> = ({ job, onNavigate }) => {

    if (!job) {
        return (
             <div className="bg-brand-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                    <div className="max-w-2xl mx-auto text-center bg-white p-10 rounded-2xl shadow-xl">
                        <h1 className="mt-6 text-3xl md:text-4xl font-extrabold text-brand-gray-900 tracking-tight">Something went wrong</h1>
                         <p className="mt-4 text-lg text-brand-gray-600">
                            We couldn't find the job details for your application.
                        </p>
                        <button
                            onClick={() => onNavigate('careers')}
                            className="mt-10 w-full sm:w-auto bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all"
                        >
                            Back to Careers
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
                    <h1 className="mt-6 text-3xl md:text-4xl font-extrabold text-brand-gray-900 tracking-tight">Application Received!</h1>
                    <p className="mt-4 text-lg text-brand-gray-600">
                        Thank you for your interest in Kytriq. We have successfully received your application for the
                        <strong className="text-techflex-blue-700"> {job.title} </strong>
                        position.
                    </p>
                    <p className="mt-2 text-brand-gray-600">We will review your submission and get back to you if your qualifications match our needs. </p>
                    
                    <div className="mt-10">
                         <button
                            onClick={() => onNavigate('careers')}
                            className="w-full sm:w-auto bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all"
                        >
                            Return to Careers Page
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareerApplicationConfirmationPage;
