
import React, { useState, useEffect } from 'react';
import { usePerformanceMonitor } from '../utils/performanceMonitor';
import { User } from '../data/account';
import { useContent } from '../contexts/ContentContext';
import Icon from '../components/Icon';

interface AdminUserFormProps {
  user: User | null;
  onNavigate: (page: string) => void;
}

const emptyUser: User = {
    id: '',
    fullName: '',
    email: '',
    role: 'customer',
    memberSince: new Date().toISOString().split('T')[0],
    shippingAddress: {
        address: '',
        city: '',
        state: '',
        zip: '',
    },
};

const AdminUserForm: React.FC<AdminUserFormProps> = ({ user, onNavigate }) => {
    usePerformanceMonitor('AdminUserForm');
    const { saveUser } = useContent();
    const [formData, setFormData] = useState<User>(user || emptyUser);
    const isNew = !user;

    useEffect(() => {
        setFormData(user || emptyUser);
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (Object.keys(formData.shippingAddress).includes(name)) {
             setFormData(prev => ({ 
                 ...prev, 
                 shippingAddress: {
                     ...prev.shippingAddress,
                     [name]: value
                 }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value as any }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const userToSave: User = {
            ...formData,
            id: isNew ? `user_${Date.now()}` : formData.id,
        };
        saveUser(userToSave);
        onNavigate('admin');
    };

    const FormField: React.FC<{ label: string; name: string; type?: string; value: string; children?: React.ReactNode }> = 
    ({ label, name, type = 'text', value, children }) => (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-brand-gray-700">{label}</label>
        {children ? children : (
             <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm"
            />
        )}
      </div>
    );

    return (
        <div className="bg-brand-gray-50 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-3xl mx-auto">
                    <button onClick={() => onNavigate('admin')} className="flex items-center text-sm font-semibold text-brand-gray-600 hover:text-techflex-blue transition-colors mb-6">
                        <Icon name="chevron-left" className="w-4 h-4 mr-1" />
                        Back to User List
                    </button>

                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-8">
                        <h1 className="text-2xl font-bold text-brand-gray-900 border-b pb-4">
                            {isNew ? 'Add New User' : 'Edit User'}
                        </h1>

                        <section>
                            <h3 className="text-lg font-semibold text-brand-gray-800 mb-4">Account Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField label="Full Name" name="fullName" value={formData.fullName} />
                                <FormField label="Email Address" name="email" type="email" value={formData.email} />
                                <FormField label="Role" name="role" value={formData.role}>
                                    <select id="role" name="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm">
                                        <option value="customer">Customer</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </FormField>
                            </div>
                        </section>

                        <section>
                             <h3 className="text-lg font-semibold text-brand-gray-800 mb-4">Shipping Address</h3>
                             <div className="space-y-4">
                                <FormField label="Address" name="address" value={formData.shippingAddress.address} />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <FormField label="City" name="city" value={formData.shippingAddress.city} />
                                    <FormField label="State" name="state" value={formData.shippingAddress.state} />
                                    <FormField label="ZIP Code" name="zip" value={formData.shippingAddress.zip} />
                                </div>
                             </div>
                        </section>

                        <div className="flex justify-end pt-4 border-t">
                            <button type="button" onClick={() => onNavigate('admin')} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-techflex-blue-500 mr-3">
                                Cancel
                            </button>
                            <button type="submit" className="bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300">
                                Save User
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminUserForm;
