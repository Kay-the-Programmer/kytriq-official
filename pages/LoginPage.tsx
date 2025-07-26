
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { useContent } from '../contexts/ContentContext';
import Snackbar, { SnackbarType } from '../components/Snackbar';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useContent();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<{ email?: boolean; password?: boolean }>({});
    const [snackbar, setSnackbar] = useState<{ isOpen: boolean; message: string; type: SnackbarType }>({
        isOpen: false,
        message: '',
        type: 'info'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});

        const result = await login(email, password);

        if (result.success) {
            setSnackbar({
                isOpen: true,
                message: result.user && result.user.role === 'admin' 
                    ? 'Login successful! Redirecting to admin dashboard...' 
                    : 'Login successful! Redirecting to your account...',
                type: 'success'
            });
            // Short delay before navigation to show the success message
            setTimeout(() => {
                // Redirect based on user role
                if (result.user && result.user.role === 'admin') {
                    // Redirect admin to admin page
                    navigate('/admin');
                } else {
                    // Redirect regular user to account page
                    navigate('/account');
                }
            }, 1500);
        } else if (result.error) {
            setError(result.error.message);
            setSnackbar({
                isOpen: true,
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
            const errorMsg = 'An error occurred during login. Please try again.';
            setError(errorMsg);
            setSnackbar({
                isOpen: true,
                message: errorMsg,
                type: 'error'
            });
        }
    };

    return (
        <div className="bg-brand-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[80vh]">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-md shadow-sm">
                <div>
                    <div className="flex justify-center">
                       <Icon name="kytriq" className="text-techflex-blue text-4xl" />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-brand-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-brand-gray-600">
                        Or{' '}
                        <button onClick={() => navigate('/signup')} className="font-medium text-techflex-blue hover:text-techflex-blue-600">
                            create a new account
                        </button>
                    </p>
                </div>
                <Snackbar
                    isOpen={snackbar.isOpen}
                    message={snackbar.message}
                    type={snackbar.type}
                    onClose={() => setSnackbar(prev => ({ ...prev, isOpen: false }))}
                />
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
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
                                } placeholder-brand-gray-500 text-brand-gray-900 rounded-t-md focus:outline-none focus:z-10 sm:text-sm`}
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
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
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-techflex-blue focus:ring-techflex-blue-dark border-brand-gray-300 rounded" />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-brand-gray-900">Remember me</label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-techflex-blue hover:text-techflex-blue-600">Forgot your password?</a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-techflex-blue hover:bg-techflex-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-techflex-blue"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <Icon name="lock-closed" className="h-5 w-5 text-white group-hover:text-white" />
                            </span>
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
