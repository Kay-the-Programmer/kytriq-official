import React, { useState } from 'react';
import { usePerformanceMonitor } from '../utils/performanceMonitor';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Icon from '../components/Icon';
import AdminDashboardPage from './AdminDashboardPage';
import AdminProductsPage from './AdminProductsPage';
import AdminBlogsPage from './AdminBlogsPage';
import AdminOrdersPage from './AdminOrdersPage';
import AdminCareersPage from './AdminCareersPage';
import AdminUsersPage from './AdminUsersPage';
import AdminSoftwarePage from './AdminSoftwarePage';

const AdminPage: React.FC = () => {
    usePerformanceMonitor('AdminPage');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // Extract the current tab from the URL path
    const currentPath = location.pathname;
    const currentTab = currentPath.split('/').pop() || 'dashboard';

    const NavItem: React.FC<{ tabName: string; iconName: string; children: React.ReactNode }> = ({ tabName, iconName, children }) => (
        <li>
            <Link
                to={`/admin/${tabName === 'dashboard' ? '' : tabName}`}
                onClick={() => setSidebarOpen(false)} // Auto-close on mobile
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                    currentTab === tabName || (tabName === 'dashboard' && currentTab === 'admin')
                        ? 'bg-techflex-blue text-white'
                        : 'text-brand-gray-600 hover:bg-brand-gray-100 hover:text-brand-gray-900'
                }`}
            >
                <Icon name={iconName} className="w-5 h-5" />
                <span>{children}</span>
            </Link>
        </li>
    );

    return (
        <div className="bg-brand-gray-50 min-h-screen">
            {/* Mobile Navbar */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b bg-white sticky top-0 z-40">
                <h1 className="text-lg font-semibold text-brand-gray-900">Admin Panel</h1>
                <button
                    className="p-2 rounded-md text-brand-gray-700 hover:bg-brand-gray-100"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    <Icon name="menu" className="w-6 h-6" />
                </button>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <aside
                    className={`z-40 w-64 bg-white border-r border-brand-gray-200 p-4 
                    transform transition-transform duration-200 ease-in-out
                    h-[calc(100vh-4rem)] overflow-y-auto fixed top-16 left-0
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                    lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen`}
                >


                <nav>
                        <ul className="space-y-2">
                            <NavItem tabName="dashboard" iconName="chart-bar">Dashboard</NavItem>
                            <NavItem tabName="orders" iconName="cart">Orders</NavItem>
                            <NavItem tabName="products" iconName="shopping-bag">Products</NavItem>
                            <NavItem tabName="software" iconName="code">Software</NavItem>
                            <NavItem tabName="users" iconName="users">Users</NavItem>
                            <NavItem tabName="blogs" iconName="document-text">Blog Posts</NavItem>
                            <NavItem tabName="careers" iconName="briefcase">Job Openings</NavItem>
                        </ul>
                    </nav>
                    <div className="absolute bottom-4 left-4 right-4">
                        <Link
                            to="/"
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-brand-gray-600 hover:bg-brand-gray-100"
                        >
                            <Icon name="chevron-left" className="w-5 h-5" />
                            <span>Back to Site</span>
                        </Link>
                    </div>
                </aside>

                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 top-16 bg-black bg-opacity-30 z-30 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-10 w-full">
                    <Routes>
                        <Route path="/" element={<AdminDashboardPage />} />
                        <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
                        <Route path="/orders" element={<AdminOrdersPage />} />
                        <Route path="/products" element={<AdminProductsPage />} />
                        <Route path="/software" element={<AdminSoftwarePage />} />
                        <Route path="/blogs" element={<AdminBlogsPage />} />
                        <Route path="/careers" element={<AdminCareersPage />} />
                        <Route path="/users" element={<AdminUsersPage />} />
                        <Route path="*" element={<Navigate to="/admin" replace />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default AdminPage;
