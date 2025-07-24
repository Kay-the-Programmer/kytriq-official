import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePerformanceMonitor } from '../utils/performanceMonitor';
import { Product } from '../contexts/ContentContext';
import { useContent } from '../contexts/ContentContext';
import { GeminiService } from '../services/api';
import Icon from '../components/Icon';

interface AdminProductFormProps {
    product: Product | null;
    onNavigate: (page: string) => void;
}

const emptyProduct: Omit<Product, 'id' | 'rating' | 'reviewCount'> & { id: string; rating: number; reviewCount: number } = {
    id: '',
    name: '',
    category: 'Accessories',
    price: 0,
    originalPrice: 0,
    imageUrl: '',
    images: [],
    description: '',
    rating: 5,
    reviewCount: 0,
    stockStatus: 'In Stock',
};

const defaultCategories: Product['category'][] = ['Accessories', 'Apparel', 'Audio', 'Laptops', 'Smartphones'];
const stockStatuses: Product['stockStatus'][] = ['In Stock', 'Low Stock', 'Out of Stock'];

const AdminProductForm: React.FC<AdminProductFormProps> = ({ product, onNavigate }) => {
    usePerformanceMonitor('AdminProductForm');
    const { saveProduct, products } = useContent();
    const [formData, setFormData] = useState<Product>(product || { ...emptyProduct, id: '' });
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [imagesBase64, setImagesBase64] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const isNew = !product;

    const extractCategories = useCallback(() => {
        const uniqueCategories = Array.from(new Set(products.map(p => p.category)));
        return uniqueCategories.length > 0 ? uniqueCategories : defaultCategories;
    }, [products]);

    const [productCategories, setProductCategories] = useState<Product['category'][]>(extractCategories());

    useEffect(() => {
        setProductCategories(extractCategories());
    }, [products, extractCategories]);

    useEffect(() => {
        if (product) {
            setFormData(product);
            setUploadedImages(product.images || []);
            setImagesBase64(product.images || []);
        } else {
            setFormData({ ...emptyProduct, id: '' });
            setUploadedImages([]);
            setImagesBase64([]);
        }
    }, [product]);

    useEffect(() => {
        return () => {
            uploadedImages.forEach(url => URL.revokeObjectURL(url));
        };
    }, [uploadedImages]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'number' ? parseFloat(value) || 0 : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setIsUploading(true);
        const files = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));

        // Check if there are too many large images
        const MAX_RECOMMENDED_IMAGES = 10;
        if (files.length > MAX_RECOMMENDED_IMAGES) {
            alert(`You're uploading ${files.length} images. This might cause performance issues. Consider uploading fewer images or smaller files.`);
        }

        // Process each file
        let processedCount = 0;
        files.forEach(file => {
            // Create a local URL for preview
            const localUrl = URL.createObjectURL(file);

            // Add to uploaded images for preview
            setUploadedImages(prev => {
                const newImages = [...prev, localUrl];

                // If this is the first image and no main image is set, set it as the main image
                if (!formData.imageUrl && prev.length === 0) {
                    setFormData(prevData => ({ ...prevData, imageUrl: localUrl }));
                }

                return newImages;
            });

            // Resize and compress the image
            const img = new Image();
            img.onload = () => {
                // Create a canvas element
                const canvas = document.createElement('canvas');

                // Set maximum dimensions - use smaller dimensions for multiple images
                const isMultipleImages = files.length > 1;
                const MAX_WIDTH = isMultipleImages ? 600 : 800;
                const MAX_HEIGHT = isMultipleImages ? 600 : 800;

                // Calculate new dimensions while maintaining aspect ratio
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height = Math.round(height * (MAX_WIDTH / width));
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width = Math.round(width * (MAX_HEIGHT / height));
                        height = MAX_HEIGHT;
                    }
                }

                // Set canvas dimensions and draw the resized image
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');

                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to base64 with reduced quality - use lower quality for multiple images
                    const isMultipleImages = files.length > 1;
                    const quality = isMultipleImages ? 0.5 : 0.7; // 50% quality for multiple images, 70% for single
                    const base64String = canvas.toDataURL('image/jpeg', quality);

                    setImagesBase64(prev => [...prev, base64String]);

                    // If this is the first image and no main image is set, set it as the main image
                    if (imagesBase64.length === 0 && !formData.imageUrl) {
                        setFormData(prevData => ({ ...prevData, imageUrl: base64String }));
                    }
                } else {
                    // Fallback if canvas context is not available
                    console.warn('Canvas context not available, image compression skipped');
                }

                processedCount++;
                if (processedCount === files.length) {
                    setIsUploading(false);
                }
            };

            img.onerror = () => {
                console.error('Error loading image');
                processedCount++;
                if (processedCount === files.length) {
                    setIsUploading(false);
                }
            };

            img.src = localUrl;
        });
    };

    const handleRemoveImage = (index: number) => {
        if (uploadedImages.length <= 1) {
            alert('At least one image is required. You cannot remove the last image.');
            return;
        }

        const removedUrl = uploadedImages[index];
        const removedBase64 = imagesBase64[index];

        // Update uploadedImages
        const newImages = [...uploadedImages];
        newImages.splice(index, 1);
        setUploadedImages(newImages);

        // Update imagesBase64
        const newImagesBase64 = [...imagesBase64];
        newImagesBase64.splice(index, 1);
        setImagesBase64(newImagesBase64);

        // If the removed image was the main image, set the first image as the main image
        if (formData.imageUrl === removedUrl || formData.imageUrl === removedBase64) {
            setFormData(prev => ({ ...prev, imageUrl: newImagesBase64[0] }));
        }

        // Revoke the object URL to free up memory
        if (removedUrl.startsWith('blob:')) {
            URL.revokeObjectURL(removedUrl);
        }
    };

    const handleSetMainImage = (url: string, index: number) => {
        // Get the corresponding base64 image
        const base64Image = imagesBase64[index];

        // Set the main image in formData
        setFormData(prev => ({ ...prev, imageUrl: base64Image }));

        // Reorder uploadedImages to put the main image first
        if (index > 0) {
            // Update uploadedImages
            const newImages = [...uploadedImages];
            const movedImage = newImages[index];
            newImages.splice(index, 1);
            newImages.unshift(movedImage);
            setUploadedImages(newImages);

            // Update imagesBase64 to match
            const newImagesBase64 = [...imagesBase64];
            const movedBase64 = newImagesBase64[index];
            newImagesBase64.splice(index, 1);
            newImagesBase64.unshift(movedBase64);
            setImagesBase64(newImagesBase64);
        }
    };

    const handleGenerateDescription = async () => {
        if (!formData.name) {
            alert('Please enter a product name first.');
            return;
        }
        setIsGenerating(true);
        try {
            const data = await GeminiService.generateProductDescription(formData.name, formData.category);

            // Check if data is null or undefined before accessing its properties
            if (!data) {
                console.error('AI description generation failed: API returned null or undefined');
                alert('Failed to generate description. Please try again.');
                return;
            }

            setFormData(prev => ({ ...prev, description: data.text || '' }));
        } catch (error) {
            console.error('AI description generation failed:', error);
            alert('Failed to generate description. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (uploadedImages.length === 0) {
            alert('Please upload at least one image.');
            return;
        }

        if (imagesBase64.length === 0) {
            alert('Please wait for the images to finish processing.');
            return;
        }

        const productToSave: Product = {
            ...formData,
            id: isNew ? undefined : formData.id, // Let backend generate ID for new products
            rating: formData.rating || 5,
            reviewCount: formData.reviewCount || 0,
            imageUrl: imagesBase64[0],
            images: imagesBase64,
        };

        await saveProduct(productToSave);
        onNavigate('admin');
    };

    const FormField: React.FC<{ label: string; name: keyof Product; type?: string; children?: React.ReactNode }> = ({ label, name, type = 'text', children }) => (
        <div>
            <label htmlFor={name.toString()} className="block text-sm font-medium text-brand-gray-700">{label}</label>
            {children || (
                <input
                    type={type}
                    id={name.toString()}
                    name={name.toString()}
                    value={formData[name] as string | number || ''}
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
                    <button onClick={() => onNavigate('admin')} className="flex items-center text-sm font-semibold text-brand-gray-600 hover:text-techflex-blue mb-6">
                        <Icon name="chevron-left" className="w-4 h-4 mr-1" />
                        Back to Product List
                    </button>

                    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg space-y-8">
                        <h1 className="text-2xl font-bold text-brand-gray-900 border-b pb-4">{isNew ? 'Add New Product' : 'Edit Product'}</h1>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="lg:col-span-2">
                                <FormField label="Product Name" name="name" />
                            </div>
                            <FormField label="Category" name="category">
                                <select name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm">
                                    {productCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </FormField>
                            <FormField label="Stock Status" name="stockStatus">
                                <select name="stockStatus" value={formData.stockStatus} onChange={handleChange} className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm">
                                    {stockStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                                </select>
                            </FormField>
                            <FormField label="Price" name="price" type="number" />
                            <FormField label="Original Price (Optional)" name="originalPrice" type="number" />
                        </div>

                        {/* Upload Area */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-brand-gray-700 mb-2">Product Images <span className="text-red-500">*</span></label>

                                <div
                                    onClick={handleUploadClick}
                                    className="relative border-2 border-dashed border-brand-gray-300 p-6 text-center rounded-md cursor-pointer hover:border-techflex-blue transition-all"
                                >
                                    <Icon name="upload" className="w-6 h-6 mx-auto text-brand-gray-500 mb-2" />
                                    <p className="text-sm text-brand-gray-600">Click to upload or drag and drop</p>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        ref={fileInputRef}
                                        className="sr-only"
                                        onChange={handleImageUpload}
                                        disabled={isUploading}
                                    />
                                </div>
                                <div className="mt-3 flex justify-center">
                                    <button
                                        type="button"
                                        onClick={handleUploadClick}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-techflex-blue hover:bg-techflex-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-techflex-blue-500"
                                        disabled={isUploading}
                                    >
                                        <Icon name="upload" className="w-4 h-4 mr-2" />
                                        Select Images
                                    </button>
                                </div>
                                {isUploading && <span className="text-sm text-brand-gray-500">Uploading...</span>}
                                <p className="text-xs text-brand-gray-500 mt-1">At least one image is required. The first image becomes the main image.</p>
                            </div>

                            {/* Image Previews */}
                            {uploadedImages.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                                    {uploadedImages.map((url, index) => (
                                        <div key={index} className={`relative group border-2 rounded-lg overflow-hidden ${formData.imageUrl === url ? 'border-techflex-blue' : 'border-brand-gray-200'}`}>
                                            <img src={url} alt={`Uploaded ${index}`} className="h-24 w-full object-cover" />
                                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleSetMainImage(url)} type="button" title="Set as main" className="p-1 bg-white rounded-full text-brand-gray-800 mr-2">
                                                    <Icon name="star" className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleRemoveImage(index)} type="button" title="Remove" className="p-1 bg-white rounded-full text-red-600">
                                                    <Icon name="trash" className="w-4 h-4" />
                                                </button>
                                            </div>
                                            {formData.imageUrl === url && (
                                                <div className="absolute top-1 right-1 bg-techflex-blue text-white rounded-full p-1">
                                                    <Icon name="check" className="w-3 h-3" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="description" className="block text-sm font-medium text-brand-gray-700">Description</label>
                                <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="flex items-center gap-1.5 text-xs font-semibold text-techflex-blue hover:text-techflex-blue-700 disabled:opacity-50 disabled:cursor-wait">
                                    <Icon name="sparkles" className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                                    {isGenerating ? 'Generating...' : 'Generate with AI'}
                                </button>
                            </div>
                            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={5} className="block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm" />
                        </div>

                        <div className="flex justify-end pt-4 border-t">
                            <button type="button" onClick={() => onNavigate('admin')} className="bg-white py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 mr-3">Cancel</button>
                            <button type="submit" className="bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300">Save Product</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminProductForm;
