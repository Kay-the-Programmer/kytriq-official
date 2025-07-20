
import React from 'react';
import { useContent } from '../contexts/ContentContext';
import Icon from '../components/Icon';
import { Order } from '../data/account';

const StatCard: React.FC<{ title: string; value: string | number; iconName: string }> = ({ title, value, iconName }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-brand-gray-100 flex items-center gap-6">
        <div className="bg-techflex-blue-100 p-4 rounded-full">
            <Icon name={iconName} className="h-8 w-8 text-techflex-blue" />
        </div>
        <div>
            <p className="text-sm font-medium text-brand-gray-500">{title}</p>
            <p className="text-3xl font-bold text-brand-gray-900">{value}</p>
        </div>
    </div>
);

const RecentOrdersTable: React.FC<{ orders: Order[] }> = ({ orders }) => {
    const statusColors = {
        Delivered: 'bg-green-100 text-green-800',
        Processing: 'bg-yellow-100 text-yellow-800',
        Shipped: 'bg-blue-100 text-blue-800',
        Cancelled: 'bg-red-100 text-red-800',
    };
    return (
        <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-brand-gray-100">
             <h2 className="text-xl font-bold text-brand-gray-800 p-6">Recent Orders</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-brand-gray-200">
                    <thead className="bg-brand-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">Order ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">Customer</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">Total</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-brand-gray-200">
                        {orders.slice(0, 5).map(order => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-techflex-blue-600">{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray-900">{order.customerName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray-500">${order.total.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray-500">{order.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


const AdminDashboardPage: React.FC = () => {
    const { products, orders, blogPosts } = useContent();

    const totalRevenue = orders
        .filter(o => o.status === 'Delivered' || o.status === 'Shipped')
        .reduce((sum, order) => sum + order.total, 0);

    const stats = [
        { title: 'Total Revenue', value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, iconName: 'currency-dollar' },
        { title: 'Total Orders', value: orders.length, iconName: 'cart' },
        { title: 'Total Products', value: products.length, iconName: 'shopping-bag' },
        { title: 'Blog Posts', value: blogPosts.length, iconName: 'document-text' },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-gray-900 mb-8">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
            </div>

            <RecentOrdersTable orders={orders} />
        </div>
    );
};

export default AdminDashboardPage;
