
import React, { useState } from 'react';
import Icon from '../components/Icon';
import { useContent } from '../contexts/ContentContext';
import Snackbar, { SnackbarType } from '../components/Snackbar';

interface SignUpPageProps {
    onNavigate: (page: string) => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate }) => {
    const { signup } = useContent();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<{ fullName?: boolean; email?: boolean; password?: boolean }>({});
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; type: SnackbarType }>({
        open: false,
        message: '',
        type: 'info'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});

        // Client-side validation
        if (password.length < 8) {
            const errorMsg = 'Password must be at least 8 characters long.';
            setError(errorMsg);
            setFieldErrors({ password: true });
            setSnackbar({
                open: true,
                message: errorMsg,
                type: 'error'
            });
            return;
        }

        const result = await signup(fullName, email, password);

        if (result.success && result.user) {
            setSnackbar({
                open: true,
                message: 'Account created successfully! Redirecting to your account...',
                type: 'success'
            });
            // Short delay before navigation to show the success message
            setTimeout(() => {
                onNavigate('account');
            }, 1500);
        } else if (result.error) {
            setError(result.error.message);
            setSnackbar({
                open: true,
                message: result.error.message,
                type: 'error'
            });

            // Set field-specific errors if available
            if (result.error.field) {
                setFieldErrors({ 
                    [result.error.field]: true 
                });
            }
        } else {
            const errorMsg = 'An error occurred during signup. Please try again.';
            setError(errorMsg);
            setSnackbar({
                open: true,
                message: errorMsg,
                type: 'error'
            });
        }
    };

    return (
        <div className="bg-brand-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[80vh]">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg">
                <div>
                     <div className="flex justify-center">
                       <Icon name="kytriq" className="text-techflex-blue text-4xl" />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-brand-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-brand-gray-600">
                        Already have an account?{' '}
                        <button onClick={() => onNavigate('login')} className="font-medium text-techflex-orange hover:text-techflex-orange-600">
                            Sign in
                        </button>
                    </p>
                </div>
                <Snackbar
                    open={snackbar.open}
                    message={snackbar.message}
                    type={snackbar.type}
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                />
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                     <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="full-name" className="sr-only">Full name</label>
                            <input
                                id="full-name"
                                name="fullName"
                                type="text"
                                autoComplete="name"
                                required
                                value={fullName}
                                onChange={(e) => {
                                    setFullName(e.target.value);
                                    if (fieldErrors.fullName) {
                                        setFieldErrors(prev => ({ ...prev, fullName: false }));
                                    }
                                }}
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                                    fieldErrors.fullName 
                                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                                        : 'border-brand-gray-300 focus:ring-techflex-blue focus:border-techflex-blue'
                                } placeholder-brand-gray-500 text-brand-gray-900 rounded-t-md focus:outline-none focus:z-10 sm:text-sm`}
                                placeholder="Full name"
                            />
                        </div>
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (fieldErrors.email) {
                                        setFieldErrors(prev => ({ ...prev, email: false }));
                                    }
                                }}
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                                    fieldErrors.email 
                                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                                        : 'border-brand-gray-300 focus:ring-techflex-blue focus:border-techflex-blue'
                                } placeholder-brand-gray-500 text-brand-gray-900 focus:outline-none focus:z-10 sm:text-sm`}
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (fieldErrors.password) {
                                        setFieldErrors(prev => ({ ...prev, password: false }));
                                    }
                                }}
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                                    fieldErrors.password 
                                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                                        : 'border-brand-gray-300 focus:ring-techflex-blue focus:border-techflex-blue'
                                } placeholder-brand-gray-500 text-brand-gray-900 rounded-b-md focus:outline-none focus:z-10 sm:text-sm`}
                                placeholder="Password (min. 8 characters)"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-techflex-blue hover:bg-techflex-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-techflex-blue"
                        >
                             <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <Icon name="lock-closed" className="h-5 w-5 text-techflex-blue-300 group-hover:text-techflex-blue-100" />
                            </span>
                            Create Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;
