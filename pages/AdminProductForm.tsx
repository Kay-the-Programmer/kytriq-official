
import React, { useState, useEffect } from 'react';
import { Product } from '../contexts/ContentContext';
import { useContent } from '../contexts/ContentContext';
import { GeminiService } from '../services/api';
import Icon from '../components/Icon';

interface AdminProductFormProps {
  product: Product | null; // null for creating a new product
  onNavigate: (page: string) => void;
}

const emptyProduct: Omit<Product, 'id' | 'rating' | 'reviewCount'> & { id: string, rating: number, reviewCount: number } = {
    id: '', name: '', category: 'Accessories', price: 0, originalPrice: 0, imageUrl: '', images: [],
    description: '', rating: 5, reviewCount: 0, stockStatus: 'In Stock',
};

const productCategories: Product['category'][] = ['Accessories', 'Apparel', 'Audio', 'Laptops', 'Smartphones'];
const stockStatuses: Product['stockStatus'][] = ['In Stock', 'Low Stock', 'Out of Stock'];

const AdminProductForm: React.FC<AdminProductFormProps> = ({ product, onNavigate }) => {
    const { saveProduct } = useContent();
    const [formData, setFormData] = useState<Product>(product || { ...emptyProduct, id: '' });
    const [isGenerating, setIsGenerating] = useState(false);
    const isNew = !product;

    useEffect(() => {
        if (product) {
            setFormData(product);
        } else {
            setFormData({ ...emptyProduct, id: '' });
        }
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'number' ? parseFloat(value) || 0 : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleGenerateDescription = async () => {
        if (!formData.name) {
            alert('Please enter a product name first.');
            return;
        }
        setIsGenerating(true);
        try {
            const data = await GeminiService.generateProductDescription(formData.name, formData.category);
            setFormData(prev => ({ ...prev, description: data.text }));
        } catch (error) {
            console.error('AI description generation failed:', error);
            alert('Failed to generate description. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const productToSave: Product = {
            ...formData,
            id: isNew ? `prod_${Date.now()}` : formData.id,
            rating: formData.rating || 5,
            reviewCount: formData.reviewCount || 0,
        };
        await saveProduct(productToSave);
        onNavigate('admin');
    };

    const FormField: React.FC<{ label: string; name: keyof Product; type?: string; children?: React.ReactNode }> = ({ label, name, type = 'text', children }) => (
      <div>
        <label htmlFor={name.toString()} className="block text-sm font-medium text-brand-gray-700">{label}</label>
        {children ? (
          children
        ) : (
          <input
            type={type}
            id={name.toString()}
            name={name.toString()}
            value={formData[name as keyof Product] as string | number || ''}
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
                        Back to Product List
                    </button>

                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-8">
                        <h1 className="text-2xl font-bold text-brand-gray-900 border-b pb-4">
                            {isNew ? 'Add New Product' : 'Edit Product'}
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField label="Product Name" name="name" />
                            <FormField label="Category" name="category">
                                <select id="category" name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm">
                                    {productCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </FormField>
                            <FormField label="Price" name="price" type="number" />
                            <FormField label="Original Price (Optional)" name="originalPrice" type="number" />
                            <FormField label="Stock Status" name="stockStatus">
                                <select id="stockStatus" name="stockStatus" value={formData.stockStatus} onChange={handleChange} className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm">
                                     {stockStatuses.map(status => <option key={status} value={status}>{status || ''}</option>)}
                                </select>
                            </FormField>
                             <FormField label="Image URL" name="imageUrl" />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="description" className="block text-sm font-medium text-brand-gray-700">Description</label>
                                <button
                                    type="button"
                                    onClick={handleGenerateDescription}
                                    disabled={isGenerating}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-techflex-blue hover:text-techflex-blue-700 disabled:opacity-50 disabled:cursor-wait"
                                >
                                    <Icon name="sparkles" className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                                    {isGenerating ? 'Generating...' : 'Generate with AI'}
                                </button>
                            </div>
                            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={5} className="block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm"></textarea>
                        </div>

                        <p className="text-xs text-brand-gray-500">Note: More complex fields like multiple images, colors, sizes, and reviews are not editable in this form.</p>

                        <div className="flex justify-end pt-4 border-t">
                            <button type="button" onClick={() => onNavigate('admin')} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-techflex-blue-500 mr-3">
                                Cancel
                            </button>
                            <button type="submit" className="bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300">
                                Save Product
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminProductForm;
