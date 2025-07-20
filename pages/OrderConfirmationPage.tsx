
import React from 'react';
import Icon from '../components/Icon';

interface OrderConfirmationPageProps {
  orderId: string | null;
  onNavigate: (page: string, id?: string) => void;
}

const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ orderId, onNavigate }) => {

    const handleContinueShopping = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onNavigate('home');
    }

    return (
        <div className="bg-brand-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                <div className="max-w-2xl mx-auto text-center bg-white p-10 rounded-2xl shadow-xl">
                    <Icon name="check-circle" className="h-16 w-16 mx-auto text-green-500"/>
                    <h1 className="mt-6 text-3xl md:text-4xl font-extrabold text-brand-gray-900 tracking-tight">Thank you for your order!</h1>
                    <p className="mt-4 text-lg text-brand-gray-600">
                        Your order has been placed successfully. A confirmation email has been sent to you.
                    </p>
                    
                    {orderId && (
                         <div className="mt-8">
                            <p className="text-sm font-medium text-brand-gray-500">Your Order ID is:</p>
                            <p className="text-lg font-mono font-bold text-techflex-blue bg-techflex-blue-100 inline-block px-4 py-2 rounded-lg mt-2">{orderId}</p>
                        </div>
                    )}

                    <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                         <button
                            onClick={handleContinueShopping}
                            className="w-full sm:w-auto bg-brand-gray-200 hover:bg-brand-gray-300 text-brand-gray-800 font-bold py-3 px-6 rounded-lg text-base transition-all"
                        >
                            Continue Shopping
                        </button>
                        <button
                            onClick={() => onNavigate('orderDetail', orderId!)}
                            disabled={!orderId}
                            className="w-full sm:w-auto bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-3 px-6 rounded-lg text-base transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:bg-brand-gray-300 disabled:cursor-not-allowed"
                        >
                            View Order Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;
