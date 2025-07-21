import React, { useState, useEffect } from 'react';
import { SoftwareProduct } from '../contexts/ContentContext';
import { useContent } from '../contexts/ContentContext';
import Icon from '../components/Icon';

interface AdminSoftwareFormProps {
  software: SoftwareProduct | null; // null for creating a new software product
  onNavigate: (page: string) => void;
}

const emptySoftware: Omit<SoftwareProduct, 'id'> & { id: string } = {
  id: '',
  name: '',
  category: 'Business',
  price: 0,
  pricingModel: 'Subscription',
  imageUrl: '',
  description: '',
  features: [],
  logoUrl: ''
};

// Default categories from the SoftwareProduct interface
const defaultCategories: SoftwareProduct['category'][] = ['Business', 'Creative', 'Productivity', 'Developer'];
const pricingModels: SoftwareProduct['pricingModel'][] = ['Subscription', 'One-Time'];

const AdminSoftwareForm: React.FC<AdminSoftwareFormProps> = ({ software, onNavigate }) => {
  const { saveSoftwareProduct, softwareProducts } = useContent();
  const [formData, setFormData] = useState<SoftwareProduct>(software || { ...emptySoftware, id: '' });
  const [features, setFeatures] = useState<string[]>(software?.features || []);
  const [newFeature, setNewFeature] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const isNew = !software;

  useEffect(() => {
    if (software) {
      setFormData(software);
      setFeatures(software.features || []);
    } else {
      setFormData({ ...emptySoftware, id: '' });
      setFeatures([]);
    }
  }, [software]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? parseFloat(value) || 0 : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isLogo = false) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setIsUploading(true);
    const file = e.target.files[0];

    // In a real application, you would upload this file to a server
    // For this example, we'll simulate the upload by creating an object URL
    const imageUrl = URL.createObjectURL(file);

    if (isLogo) {
      setFormData(prev => ({ ...prev, logoUrl: imageUrl }));
    } else {
      setFormData(prev => ({ ...prev, imageUrl: imageUrl }));
    }
    setIsUploading(false);
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures(prev => [...prev, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that an image is uploaded
    if (!formData.imageUrl) {
      alert('Please upload a product image.');
      return;
    }

    // Validate that at least one feature is added
    if (features.length === 0) {
      alert('Please add at least one feature for the software product.');
      return;
    }

    const softwareToSave: SoftwareProduct = {
      ...formData,
      id: isNew ? `soft_${Date.now()}` : formData.id,
      features: features,
    };

    await saveSoftwareProduct(softwareToSave);
    onNavigate('adminSoftware');
  };

  const FormField: React.FC<{ label: string; name: keyof SoftwareProduct; type?: string; children?: React.ReactNode }> = ({ label, name, type = 'text', children }) => (
    <div>
      <label htmlFor={name.toString()} className="block text-sm font-medium text-brand-gray-700">{label}</label>
      {children ? (
        children
      ) : (
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
        <div className="max-w-4xl mx-auto">
          <button onClick={() => onNavigate('adminSoftware')} className="flex items-center text-sm font-semibold text-brand-gray-600 hover:text-techflex-blue transition-colors mb-6">
            <Icon name="chevron-left" className="w-4 h-4 mr-1" />
            Back to Software List
          </button>

          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg space-y-8">
            <h1 className="text-2xl font-bold text-brand-gray-900 border-b pb-4">
              {isNew ? 'Add New Software' : 'Edit Software'}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <FormField label="Software Name" name="name" />
              </div>

              <FormField label="Category" name="category">
                <select id="category" name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm">
                  {defaultCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </FormField>

              <FormField label="Pricing Model" name="pricingModel">
                <select id="pricingModel" name="pricingModel" value={formData.pricingModel} onChange={handleChange} className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm">
                  {pricingModels.map(model => <option key={model} value={model}>{model}</option>)}
                </select>
              </FormField>

              <FormField label="Price" name="price" type="number" />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-gray-700 mb-2">Software Image <span className="text-red-500">*</span></label>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-techflex-blue hover:text-techflex-blue-700 focus-within:outline-none">
                      <span className="inline-flex items-center px-4 py-2 border border-brand-gray-300 rounded-md shadow-sm text-sm font-medium text-brand-gray-700 bg-white hover:bg-brand-gray-50">
                        <Icon name="upload" className="w-5 h-5 mr-2 text-brand-gray-500" />
                        Upload Image
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => handleImageUpload(e, false)}
                        disabled={isUploading}
                      />
                    </label>
                    {isUploading && <span className="text-sm text-brand-gray-500">Uploading...</span>}
                  </div>
                </div>
              </div>

              {/* Logo Upload Section */}
              <div>
                <label className="block text-sm font-medium text-brand-gray-700 mb-2">Software Logo (Optional)</label>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-techflex-blue hover:text-techflex-blue-700 focus-within:outline-none">
                      <span className="inline-flex items-center px-4 py-2 border border-brand-gray-300 rounded-md shadow-sm text-sm font-medium text-brand-gray-700 bg-white hover:bg-brand-gray-50">
                        <Icon name="upload" className="w-5 h-5 mr-2 text-brand-gray-500" />
                        Upload Logo
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => handleImageUpload(e, true)}
                        disabled={isUploading}
                      />
                    </label>
                    {isUploading && <span className="text-sm text-brand-gray-500">Uploading...</span>}
                  </div>
                </div>
              </div>

              {/* Image Preview */}
              {formData.imageUrl && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-brand-gray-700 mb-2">Software Image</h3>
                  <div className="relative group rounded-lg overflow-hidden border-2 border-brand-gray-200 w-40 h-40">
                    <img
                      src={formData.imageUrl}
                      alt="Software"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Logo Preview */}
              {formData.logoUrl && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-brand-gray-700 mb-2">Software Logo</h3>
                  <div className="relative group rounded-lg overflow-hidden border-2 border-brand-gray-200 w-40 h-40">
                    <img
                      src={formData.logoUrl}
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-brand-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm"
              ></textarea>
            </div>

            {/* Features Section */}
            <div>
              <label className="block text-sm font-medium text-brand-gray-700 mb-2">Features <span className="text-red-500">*</span></label>
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature"
                  className="flex-1 rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-techflex-blue hover:bg-techflex-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-techflex-blue"
                >
                  <Icon name="plus" className="w-4 h-4 mr-1" />
                  Add
                </button>
              </div>
              <ul className="space-y-2 mt-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center justify-between bg-brand-gray-50 p-2 rounded-md">
                    <span className="text-sm text-brand-gray-700">{feature}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Icon name="trash" className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
              {features.length === 0 && (
                <p className="text-xs text-brand-gray-500 mt-1">Add at least one feature for the software product.</p>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button
                type="button"
                onClick={() => onNavigate('adminSoftware')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-techflex-blue-500 mr-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300"
              >
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