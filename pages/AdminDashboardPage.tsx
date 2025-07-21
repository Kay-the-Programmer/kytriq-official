import React from 'react';
import { useContent } from '../contexts/ContentContext';
import Icon from '../components/Icon';
import { Order } from '../data/account';

const StatCard: React.FC<{ title: string; value: string | number; iconName: string }> = ({ title, value, iconName }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4 min-w-0">
        <div className="bg-techflex-blue-100 p-3 rounded-full shrink-0">
            <Icon name={iconName} className="h-6 w-6 text-techflex-blue" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 truncate">{title}</p>
            <p className="text-lg md:text-xl font-semibold text-brand-gray-900 break-words">{value}</p>
        </div>
    </div>
);

const RecentOrdersTable: React.FC<{ orders: Order[] }> = ({ orders }) => {
    const statusColors: Record<string, string> = {
        Delivered: 'bg-green-100 text-green-700',
        Processing: 'bg-yellow-100 text-yellow-700',
        Shipped: 'bg-blue-100 text-blue-700',
        Cancelled: 'bg-red-100 text-red-700',
    };

    return (
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="text-lg font-medium text-brand-gray-800">Recent Orders</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm divide-y divide-gray-200">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                    <tr>
                        <th className="px-4 py-2 text-left whitespace-nowrap">Order ID</th>
                        <th className="px-4 py-2 text-left whitespace-nowrap">Customer</th>
                        <th className="px-4 py-2 text-left whitespace-nowrap">Total</th>
                        <th className="px-4 py-2 text-left whitespace-nowrap">Status</th>
                        <th className="px-4 py-2 text-left whitespace-nowrap">Date</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                    {orders.slice(0, 5).map(order => (
                        <tr key={order.id} className="hover:bg-gray-50 transition">
                            <td className="px-4 py-3 text-techflex-blue-600 font-medium">{order.id}</td>
                            <td className="px-4 py-3 text-gray-800">{order.customerName}</td>
                            <td className="px-4 py-3 text-gray-700">${order.total.toFixed(2)}</td>
                            <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                            </td>
                            <td className="px-4 py-3 text-gray-500">{order.date}</td>
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
        {
            title: 'Total Revenue',
            value: `$${totalRevenue.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`,
            iconName: 'currency-dollar',
        },
        { title: 'Total Orders', value: orders.length, iconName: 'cart' },
        { title: 'Total Products', value: products.length, iconName: 'shopping-bag' },
        { title: 'Blog Posts', value: blogPosts.length, iconName: 'document-text' },
    ];

    return (
        <div className="">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-gray-900 mb-5">Dashboard</h1>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {stats.map(stat => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </div>

            {/* Orders Table */}
            <RecentOrdersTable orders={orders} />
        </div>
    );
};

export default AdminDashboardPage;
