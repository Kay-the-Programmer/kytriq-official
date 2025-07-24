import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';

const UnauthorizedPage: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <div>
                    <Icon name="shield-off" className="mx-auto h-16 w-16 text-techflex-orange" />
                    <h2 className="mt-6 text-3xl font-extrabold text-brand-gray-900">
                        Access Denied
                    </h2>
                    <p className="mt-2 text-sm text-brand-gray-600">
                        You don't have permission to access this page.
                    </p>
                </div>
                <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                    <div className="text-left">
                        <p className="text-brand-gray-700 mb-4">
                            This page requires administrator privileges. If you believe you should have access, please contact your system administrator.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center text-sm text-brand-gray-600">
                                <Icon name="info" className="flex-shrink-0 mr-2 h-5 w-5 text-techflex-blue" />
                                <p>Administrator access is required for API documentation and management tools.</p>
                            </div>
                            <div className="flex items-center text-sm text-brand-gray-600">
                                <Icon name="users" className="flex-shrink-0 mr-2 h-5 w-5 text-techflex-blue" />
                                <p>Contact your team lead or IT department to request access if needed.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center space-x-4">
                    <Link
                        to="/"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-techflex-blue hover:bg-techflex-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-techflex-blue transition-all duration-300"
                    >
                        <Icon name="home" className="mr-2 -ml-1 h-5 w-5" />
                        Return Home
                    </Link>
                    <Link
                        to="/contact"
                        className="inline-flex items-center px-4 py-2 border border-brand-gray-300 text-sm font-medium rounded-md text-brand-gray-700 bg-white hover:bg-brand-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-techflex-blue transition-all duration-300"
                    >
                        <Icon name="mail" className="mr-2 -ml-1 h-5 w-5" />
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedPage;