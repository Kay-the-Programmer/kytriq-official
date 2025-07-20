
import React from 'react';
import { Order } from '../data/account';
import Icon from '../components/Icon';

interface OrderDetailPageProps {
  order: Order;
  onNavigate: (page: string, id?: string) => void;
}

const OrderStatusTracker: React.FC<{ status: Order['status'] }> = ({ status }) => {
    const statuses: Order['status'][] = ['Processing', 'Shipped', 'Delivered'];
    const currentStatusIndex = statuses.indexOf(status);

    const getStatusInfo = (stepStatus: Order['status'], index: number) => {
        if (index < currentStatusIndex) {
            return { color: 'techflex-orange', icon: 'check' };
        }
        if (index === currentStatusIndex) {
            return { color: 'techflex-orange', icon: 'refresh' };
        }
        return { color: 'brand-gray', icon: 'clock' };
    };

    if (status === 'Cancelled') {
        return (
            <div className="flex items-center gap-3 bg-red-100 text-red-700 font-semibold p-4 rounded-lg">
                <Icon name="trash" className="h-6 w-6" />
                <span>This order has been cancelled.</span>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-between">
            {statuses.map((stepStatus, index) => {
                const { color, icon } = getStatusInfo(stepStatus, index);
                const isCompleted = index < currentStatusIndex;
                const isActive = index === currentStatusIndex;

                return (
                    <React.Fragment key={stepStatus}>
                        <div className="flex flex-col items-center text-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${isActive ? `bg-${color}-100 border-${color}-500` : isCompleted ? `bg-${color}-500 border-${color}-500` : 'bg-white border-brand-gray-300'}`}>
                               <Icon name={icon} className={`h-6 w-6 ${isCompleted ? 'text-white' : `text-${color}-500`}`} />
                            </div>
                            <p className={`mt-2 text-sm font-semibold ${isActive || isCompleted ? 'text-brand-gray-800' : 'text-brand-gray-500'}`}>{stepStatus}</p>
                        </div>
                        {index < statuses.length - 1 && (
                             <div className={`flex-1 h-1 mx-4 rounded ${isCompleted ? `bg-${color}-500` : 'bg-brand-gray-200'}`}></div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};


const OrderDetailPage: React.FC<OrderDetailPageProps> = ({ order, onNavigate }) => {

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 5.00;
  const taxes = subtotal * 0.08;
  const total = subtotal + shipping + taxes;

  return (
    <div className="bg-brand-gray-50 min-h-screen py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
             <button
                onClick={() => window.history.back()} // Simple back navigation
                className="flex items-center text-sm font-semibold text-brand-gray-600 hover:text-techflex-blue transition-colors"
            >
                <Icon name="chevron-left" className="w-4 h-4 mr-1" />
                Back
            </button>
          </div>
          
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-brand-gray-900 tracking-tight">Order Details</h1>
            <p className="mt-2 text-brand-gray-500">
                Order <span className="font-semibold text-techflex-blue-700">{order.id}</span>
                <span className="mx-2 text-brand-gray-300">|</span>
                Placed on {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </header>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-brand-gray-200 mb-8">
            <OrderStatusTracker status={order.status} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg border border-brand-gray-200">
                <h2 className="text-xl font-bold text-brand-gray-800 mb-6">Items in this order ({order.items.length})</h2>
                <div className="space-y-6">
                    {order.items.map(item => (
                        <div key={item.id} className="flex items-center gap-4 border-b border-brand-gray-100 pb-6 last:border-b-0">
                            <img src={item.imageUrl} alt={item.name} className="w-24 h-24 rounded-lg object-cover" />
                            <div className="flex-1">
                                <p className="font-bold text-brand-gray-800">{item.name}</p>
                                <p className="text-sm text-brand-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-lg font-semibold text-brand-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="lg:col-span-1 space-y-8">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-brand-gray-200">
                    <h2 className="text-xl font-bold text-brand-gray-800 mb-4">Shipping Address</h2>
                    <div className="text-brand-gray-600">
                        <p className="font-semibold">{order.customerName}</p>
                        <p>123 Tech Lane</p>
                        <p>Innovateville, CA 94043</p>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-brand-gray-200">
                     <h2 className="text-xl font-bold text-brand-gray-800 mb-4">Billing Summary</h2>
                     <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><p className="text-brand-gray-600">Subtotal</p><p className="font-medium text-brand-gray-800">${subtotal.toFixed(2)}</p></div>
                        <div className="flex justify-between"><p className="text-brand-gray-600">Shipping</p><p className="font-medium text-brand-gray-800">${shipping.toFixed(2)}</p></div>
                        <div className="flex justify-between"><p className="text-brand-gray-600">Taxes</p><p className="font-medium text-brand-gray-800">${taxes.toFixed(2)}</p></div>
                        <div className="flex justify-between text-base font-bold text-brand-gray-900 pt-2 border-t mt-2"><p>Total</p><p>${order.total.toFixed(2)}</p></div>
                     </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
