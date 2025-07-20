
import React, { useState, useEffect } from 'react';
import { SoftwareProduct } from '../contexts/ContentContext';
import { useContent } from '../contexts/ContentContext';
import { GeminiService } from '../services/api';
import Icon from '../components/Icon';

interface AdminSoftwareFormProps {
  software: SoftwareProduct | null;
  onNavigate: (page: string) => void;
}

const emptySoftware: SoftwareProduct = {
    id: '', name: '', category: 'Business', price: 0, pricingModel: 'Subscription',
    imageUrl: '', description: '', features: [], logoUrl: 'briefcase',
};

const softwareCategories: SoftwareProduct['category'][] = ['Business', 'Creative', 'Productivity', 'Developer'];
const pricingModels: SoftwareProduct['pricingModel'][] = ['Subscription', 'One-Time'];
const logoIcons = ['briefcase', 'code', 'compass', 'github', 'sparkles', 'rocket-launch', 'cpu-chip'];


const AdminSoftwareForm: React.FC<AdminSoftwareFormProps> = ({ software, onNavigate }) => {
    const { saveSoftwareProduct } = useContent();
    const [formData, setFormData] = useState<SoftwareProduct>(software || emptySoftware);
    const [isGenerating, setIsGenerating] = useState(false);
    const isNew = !software;

    useEffect(() => {
        setFormData(software || emptySoftware);
    }, [software]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (name === 'features') {
            setFormData(prev => ({...prev, features: value.split('\n') }));
        } else {
            const val = type === 'number' ? parseFloat(value) || 0 : value;
            setFormData(prev => ({ ...prev, [name]: val }));
        }
    };

    const handleGenerateContent = async () => {
        if (!formData.name) {
            alert('Please enter a software name first.');
            return;
        }
        setIsGenerating(true);
        try {
            const data = await GeminiService.generateSoftwareContent(formData.name, formData.category);
            setFormData(prev => ({ ...prev, description: data.description, features: data.features }));
        } catch (error) {
            console.error('AI content generation failed:', error);
            alert('Failed to generate content. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const softwareToSave: SoftwareProduct = {
            ...formData,
            id: isNew ? `sw_${Date.now()}` : formData.id,
            features: formData.features.filter(f => f.trim() !== ''),
        };
        await saveSoftwareProduct(softwareToSave);
        onNavigate('admin');
    };

    const FormField: React.FC<{ label: string; name: keyof SoftwareProduct; type?: string; children?: React.ReactNode }> = ({ label, name, type = 'text', children }) => (
      <div>
        <label htmlFor={name.toString()} className="block text-sm font-medium text-brand-gray-700">{label}</label>
        {children ? children : (
          <input
            type={type}
            id={name.toString()}
            name={name.toString()}
            value={formData[name as keyof SoftwareProduct] as string | number || ''}
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
                        Back to Admin Panel
                    </button>

                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-8">
                        <h1 className="text-2xl font-bold text-brand-gray-900 border-b pb-4">
                            {isNew ? 'Add New Software' : 'Edit Software'}
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField label="Software Name" name="name" />
                            <FormField label="Category" name="category">
                                <select id="category" name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm">
                                    {softwareCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </FormField>
                            <FormField label="Price" name="price" type="number" />
                             <FormField label="Pricing Model" name="pricingModel">
                                <select id="pricingModel" name="pricingModel" value={formData.pricingModel} onChange={handleChange} className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm">
                                    {pricingModels.map(pm => <option key={pm} value={pm}>{pm}</option>)}
                                </select>
                            </FormField>
                             <FormField label="Image URL" name="imageUrl" />
                             <FormField label="Logo Icon" name="logoUrl">
                                <select id="logoUrl" name="logoUrl" value={formData.logoUrl} onChange={handleChange} className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm">
                                    {logoIcons.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                                </select>
                            </FormField>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="description" className="block text-sm font-medium text-brand-gray-700">Description & Features</label>
                                <button type="button" onClick={handleGenerateContent} disabled={isGenerating} className="flex items-center gap-1.5 text-xs font-semibold text-techflex-blue hover:text-techflex-blue-700 disabled:opacity-50 disabled:cursor-wait">
                                    <Icon name="sparkles" className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                                    {isGenerating ? 'Generating...' : 'Generate with AI'}
                                </button>
                            </div>
                            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className="block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm" placeholder="Description..."></textarea>
                            <textarea id="features" name="features" value={formData.features.join('\n')} onChange={handleChange} rows={5} className="mt-2 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm" placeholder="Features (one per line)..."></textarea>
                        </div>

                        <div className="flex justify-end pt-4 border-t">
                            <button type="button" onClick={() => onNavigate('admin')} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-techflex-blue-500 mr-3">
                                Cancel
                            </button>
                            <button type="submit" className="bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300">
                                Save Software
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminSoftwareForm;
