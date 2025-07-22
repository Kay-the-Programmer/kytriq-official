
import React, { useState, useEffect } from 'react';
import { useContent } from '../contexts/ContentContext';
import { Order } from '../data/account';
import Icon from '../components/Icon';

interface AdminOrdersPageProps {
  onNavigate: (page: string, id: string) => void;
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

const AdminOrdersPage: React.FC<AdminOrdersPageProps> = ({ onNavigate }) => {
  const { orders, updateOrderStatus } = useContent();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'All'>('All');
  const [dateFilter, setDateFilter] = useState<'All' | 'Last 30 Days' | 'Last 90 Days' | 'This Year'>('All');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
  };

  const statusOptions: Order['status'][] = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const statusColors = {
      Delivered: 'bg-green-100 text-green-800',
      Processing: 'bg-yellow-100 text-yellow-800',
      Shipped: 'bg-blue-100 text-blue-800',
      Cancelled: 'bg-red-100 text-red-800',
  };

  // Filter orders based on search term, status filter, and date filter
  useEffect(() => {
    let result = [...orders];

    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.id.toLowerCase().includes(lowerSearchTerm) || 
        order.customerName.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Apply status filter
    if (statusFilter !== 'All') {
      result = result.filter(order => order.status === statusFilter);
    }

    // Apply date filter
    if (dateFilter !== 'All') {
      const today = new Date();
      const filterDate = new Date();

      if (dateFilter === 'Last 30 Days') {
        filterDate.setDate(today.getDate() - 30);
      } else if (dateFilter === 'Last 90 Days') {
        filterDate.setDate(today.getDate() - 90);
      } else if (dateFilter === 'This Year') {
        filterDate.setFullYear(today.getFullYear(), 0, 1);
      }

      result = result.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate >= filterDate;
      });
    }

    setFilteredOrders(result);
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setDateFilter('All');
  };

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-gray-900 mb-8">Manage Orders</h1>

      {selectedOrder ? (
        // Order Detail View
        <div>
          <div className="mb-8">
            <button
              onClick={handleBackToList}
              className="flex items-center text-sm font-semibold text-brand-gray-600 hover:text-techflex-blue transition-colors"
            >
              <Icon name="chevron-left" className="w-4 h-4 mr-1" />
              Back to Orders List
            </button>
          </div>

          <header className="mb-8">
            <h2 className="text-2xl font-bold text-brand-gray-900 tracking-tight">Order Details</h2>
            <p className="mt-2 text-brand-gray-500">
              Order <span className="font-semibold text-techflex-blue-700">{selectedOrder.id}</span>
              <span className="mx-2 text-brand-gray-300">|</span>
              Placed on {new Date(selectedOrder.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </header>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-brand-gray-200 mb-8">
            <OrderStatusTracker status={selectedOrder.status} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg border border-brand-gray-200">
              <h2 className="text-xl font-bold text-brand-gray-800 mb-6">Items in this order ({selectedOrder.items.length})</h2>
              <div className="space-y-6">
                {selectedOrder.items.map(item => (
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
                  <p className="font-semibold">{selectedOrder.customerName}</p>
                  <p>123 Tech Lane</p>
                  <p>Innovateville, CA 94043</p>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-brand-gray-200">
                <h2 className="text-xl font-bold text-brand-gray-800 mb-4">Billing Summary</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <p className="text-brand-gray-600">Subtotal</p>
                    <p className="font-medium text-brand-gray-800">
                      ${selectedOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-brand-gray-600">Shipping</p>
                    <p className="font-medium text-brand-gray-800">$5.00</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-brand-gray-600">Taxes</p>
                    <p className="font-medium text-brand-gray-800">
                      ${(selectedOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.08).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex justify-between text-base font-bold text-brand-gray-900 pt-2 border-t mt-2">
                    <p>Total</p>
                    <p>${selectedOrder.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-brand-gray-200">
                <h2 className="text-xl font-bold text-brand-gray-800 mb-4">Update Status</h2>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as Order['status'])}
                  className="w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm p-2"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Orders List View
        <>
          {/* Search and Filter Section */}
          <div className="bg-white p-4 mb-6 rounded-2xl shadow-md border border-brand-gray-100">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="search" className="h-5 w-5 text-brand-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by order ID or customer name"
                    className="block w-full pl-10 pr-3 py-2 border border-brand-gray-300 rounded-md leading-5 bg-white placeholder-brand-gray-500 focus:outline-none focus:ring-techflex-blue focus:border-techflex-blue sm:text-sm"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="w-full md:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as Order['status'] | 'All')}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-brand-gray-300 focus:outline-none focus:ring-techflex-blue focus:border-techflex-blue sm:text-sm rounded-md"
                >
                  <option value="All">All Statuses</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div className="w-full md:w-48">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as 'All' | 'Last 30 Days' | 'Last 90 Days' | 'This Year')}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-brand-gray-300 focus:outline-none focus:ring-techflex-blue focus:border-techflex-blue sm:text-sm rounded-md"
                >
                  <option value="All">All Time</option>
                  <option value="Last 30 Days">Last 30 Days</option>
                  <option value="Last 90 Days">Last 90 Days</option>
                  <option value="This Year">This Year</option>
                </select>
              </div>

              {/* Clear Filters Button */}
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-techflex-blue hover:bg-techflex-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-techflex-blue"
              >
                <Icon name="x-circle" className="mr-2 h-5 w-5" />
                Clear Filters
              </button>
            </div>

            {/* Results Count */}
            <div className="text-sm text-brand-gray-600">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-brand-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-brand-gray-200">
                <thead className="bg-brand-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">Order ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">Customer</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">Total</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">Update Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-brand-gray-200">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button onClick={() => handleSelectOrder(order)} className="text-techflex-blue-600 hover:underline">
                            {order.id}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray-500">{order.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray-900">{order.customerName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray-500">${order.total.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                            className="rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm"
                          >
                            {statusOptions.map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-brand-gray-500">
                        No orders found matching your filters. <button onClick={clearFilters} className="text-techflex-blue hover:underline">Clear filters</button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOrdersPage;
