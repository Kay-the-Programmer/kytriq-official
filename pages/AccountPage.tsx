
import React, { useState, useEffect } from 'react';
import { Order, User } from '../contexts/ContentContext';
import Icon from '../components/Icon';
import { useContent } from '../contexts/ContentContext';

interface AccountPageProps {
    onNavigate: (page: string, id?: string) => void;
}
const OrderCard: React.FC<{ order: Order; onNavigate: (page: string, id: string) => void; }> = ({ order, onNavigate }) => {
    const statusColors = {
        Delivered: 'bg-green-100 text-green-800',
        Processing: 'bg-yellow-100 text-yellow-800',
        Shipped: 'bg-blue-100 text-blue-800',
        Cancelled: 'bg-red-100 text-red-800',
    };

    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-brand-gray-200">
            <div className="bg-brand-gray-50 p-4 flex flex-col sm:flex-row justify-between sm:items-center border-b border-brand-gray-200">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm w-full">
                    <div>
                        <p className="text-brand-gray-500 font-semibold">Order placed</p>
                        <p className="text-brand-gray-800">{order.date}</p>
                    </div>
                    <div>
                        <p className="text-brand-gray-500 font-semibold">Total</p>
                        <p className="text-brand-gray-800 font-bold">${order.total.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-brand-gray-500 font-semibold">Order ID</p>
                        <p className="text-brand-gray-800">{order.id}</p>
                    </div>
                    <div className="flex items-start sm:justify-end">
                        <button onClick={() => onNavigate('orderDetail', order.id)} className="text-sm font-semibold text-techflex-blue-600 hover:text-techflex-blue-800 transition-colors">View Details &rarr;</button>
                    </div>
                </div>
            </div>
            <div className="p-4 space-y-4">
                <div className='flex justify-between items-start'>
                    <div className="space-y-4">
                        {order.items.map(item => (
                            <div key={item.id} className="flex items-center gap-4">
                                <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                                <div>
                                    <p className="font-bold text-brand-gray-800">{item.name}</p>
                                    <p className="text-sm text-brand-gray-500">Qty: {item.quantity}</p>
                                    <p className="text-sm text-brand-gray-500">${item.price.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                     <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {order.status}
                    </span>
                </div>
            </div>
        </div>
    );
};

const ProfileSettings: React.FC = () => {
    const { currentUser, saveUser } = useContent();
    const [user, setUser] = useState<User | null>(currentUser);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        setUser(currentUser);
    }, [currentUser]);

    if (!user) {
        return <div>Loading profile...</div>;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser(prevUser => {
            if (!prevUser) return null;
            if (Object.keys(prevUser.shippingAddress).includes(name)) {
                return {
                    ...prevUser,
                    shippingAddress: {
                        ...prevUser.shippingAddress,
                        [name]: value
                    }
                };
            }
            return { ...prevUser, [name]: value };
        });
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (user) {
            await saveUser(user);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        }
    };

    const FormField: React.FC<{ label: string; name: string; value: string; }> = 
    ({ label, name, value }) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-brand-gray-700">{label}</label>
            <input
                type="text"
                id={name}
                name={name}
                value={value}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm"
            />
        </div>
    );

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-brand-gray-200">
            <form onSubmit={handleSubmit} className="space-y-8">
                <section>
                    <h3 className="text-xl font-bold text-brand-gray-800 border-b border-brand-gray-200 pb-4">Personal Details</h3>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Full Name" name="fullName" value={user.fullName} />
                        <FormField label="Email Address" name="email" value={user.email} />
                    </div>
                </section>
                <section>
                    <h3 className="text-xl font-bold text-brand-gray-800 border-b border-brand-gray-200 pb-4">Shipping Address</h3>
                     <div className="mt-6 space-y-4">
                       <FormField label="Address" name="address" value={user.shippingAddress.address} />
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField label="City" name="city" value={user.shippingAddress.city} />
                            <FormField label="State" name="state" value={user.shippingAddress.state} />
                            <FormField label="ZIP Code" name="zip" value={user.shippingAddress.zip} />
                       </div>
                    </div>
                </section>
                <div className="flex justify-end items-center pt-4 gap-4">
                     {isSaved && <p className="text-sm font-medium text-green-600">Changes saved successfully!</p>}
                     <button type="submit" className="bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

const AccountPage: React.FC<AccountPageProps> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState('orders');
    const { currentUser, orders } = useContent();

    const userOrders = orders.filter(o => o.customerName === currentUser?.fullName);

    const TabButton: React.FC<{tabName: string; children: React.ReactNode}> = ({ tabName, children }) => (
         <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200 ${
                activeTab === tabName
                    ? 'bg-techflex-blue text-white shadow'
                    : 'bg-white text-brand-gray-700 hover:bg-brand-gray-200'
            }`}
        >
            {children}
        </button>
    );

    return (
        <div className="bg-brand-gray-50 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-brand-gray-900 tracking-tight mb-2">My Account</h1>
                    <p className="text-lg text-brand-gray-600 mb-8">Welcome back, {currentUser?.fullName}!</p>
                    
                    <div className="flex flex-wrap gap-4 mb-8 border-b border-brand-gray-200 pb-4">
                       <TabButton tabName="orders">Order History</TabButton>
                       <TabButton tabName="profile">Profile Settings</TabButton>
                    </div>

                    <div>
                        {activeTab === 'orders' && (
                            <div className="space-y-6">
                                {userOrders.map(order => (
                                    <OrderCard key={order.id} order={order} onNavigate={onNavigate} />
                                ))}
                                {userOrders.length === 0 && (
                                    <div className="text-center bg-white p-8 rounded-xl">
                                        <p className="font-semibold">No orders found.</p>
                                        <button onClick={() => onNavigate('products')} className="mt-4 bg-techflex-orange text-white px-4 py-2 rounded-lg">Start Shopping</button>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === 'profile' && (
                           <ProfileSettings />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
