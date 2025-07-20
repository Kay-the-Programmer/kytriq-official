
import React, { useState } from 'react';
import Icon from '../components/Icon';
import AdminDashboardPage from './AdminDashboardPage';
import AdminProductsPage from './AdminProductsPage';
import AdminBlogsPage from './AdminBlogsPage';
import AdminOrdersPage from './AdminOrdersPage';
import AdminCareersPage from './AdminCareersPage';
import AdminUsersPage from './AdminUsersPage';
import AdminSoftwarePage from './AdminSoftwarePage';

interface AdminPageProps {
  onNavigate: (page: string, id?: string) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const NavItem: React.FC<{ tabName: string; iconName: string; children: React.ReactNode }> = ({ tabName, iconName, children }) => (
    <li>
      <button
        onClick={() => setActiveTab(tabName)}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === tabName
                ? 'bg-techflex-blue text-white'
                : 'text-brand-gray-600 hover:bg-brand-gray-100 hover:text-brand-gray-900'
        }`}
      >
        <Icon name={iconName} className="w-5 h-5" />
        <span>{children}</span>
      </button>
    </li>
  );

  const renderContent = () => {
    switch (activeTab) {
        case 'dashboard':
            return <AdminDashboardPage />;
        case 'orders':
            return <AdminOrdersPage onNavigate={onNavigate} />;
        case 'products':
            return <AdminProductsPage onNavigate={onNavigate} />;
        case 'software':
            return <AdminSoftwarePage onNavigate={onNavigate} />;
        case 'blogs':
            return <AdminBlogsPage onNavigate={onNavigate} />;
        case 'careers':
            return <AdminCareersPage onNavigate={onNavigate} />;
        case 'users':
            return <AdminUsersPage onNavigate={onNavigate} />;
        default:
            return <AdminDashboardPage />;
    }
  };

  return (
    <div className="bg-brand-gray-50 min-h-screen">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white p-4 border-r border-brand-gray-200 h-screen sticky top-0">
            <div className="mb-8">
                <Icon name="kytriq" className="text-techflex-blue" />
            </div>
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
                 <button onClick={() => onNavigate('home')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-brand-gray-600 hover:bg-brand-gray-100">
                    <Icon name="chevron-left" className="w-5 h-5" />
                    <span>Back to Site</span>
                </button>
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 sm:p-10">
            {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
