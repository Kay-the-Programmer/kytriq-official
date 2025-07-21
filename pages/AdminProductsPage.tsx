
import React, { useState, useRef } from 'react';
import { useContent } from '../contexts/ContentContext';
import Icon from '../components/Icon';
import Snackbar from '../components/Snackbar';

interface AdminProductsPageProps {
  onNavigate: (page: string, id?: string) => void;
}

const AdminProductsPage: React.FC<AdminProductsPageProps> = ({ onNavigate }) => {
  const { products, deleteProduct, saveProduct } = useContent();
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stockStatus: 'In Stock',
    imageUrl: ''
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imagesBase64, setImagesBase64] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error' | 'info'>('success');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleEdit = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        category: product.category,
        stockStatus: product.stockStatus,
        imageUrl: product.imageUrl
      });
      setUploadedImages(product.images || []);
      setImagesBase64(product.images || []);
      setShowProductForm(true);
    }
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stockStatus: 'In Stock',
      imageUrl: ''
    });
    setUploadedImages([]);
    setImagesBase64([]);
    setShowProductForm(true);
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
    files.forEach(file => {
      // Create a local URL for preview
      const localUrl = URL.createObjectURL(file);
      setUploadedImages(prev => [...prev, localUrl]);

      // Resize and convert the image to a base64 string
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

          // If this is the first image, set it as the main image
          if (uploadedImages.length === 0 && !formData.imageUrl) {
            setFormData(prev => ({ ...prev, imageUrl: base64String }));
          }

          if (files.indexOf(file) === files.length - 1) {
            setIsUploading(false);
          }
        } else {
          // Fallback to original method if canvas context is not available
          // For large files, we'll add a warning about potential payload size issues
          const fileSizeMB = file.size / (1024 * 1024);
          if (fileSizeMB > 5 && files.length > 1) {
            console.warn(`Large file detected (${fileSizeMB.toFixed(2)}MB) with multiple uploads. This may cause upload issues.`);
          }

          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result as string;
            setImagesBase64(prev => [...prev, base64String]);

            // If this is the first image, set it as the main image
            if (uploadedImages.length === 0 && !formData.imageUrl) {
              setFormData(prev => ({ ...prev, imageUrl: base64String }));
            }

            if (files.indexOf(file) === files.length - 1) {
              setIsUploading(false);
            }
          };
          reader.onerror = () => {
            console.error('Error reading file');
            if (files.indexOf(file) === files.length - 1) {
              setIsUploading(false);
            }
          };
          reader.readAsDataURL(file);
        }
      };

      img.onerror = () => {
        console.error('Error loading image');
        if (files.indexOf(file) === files.length - 1) {
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

    // Create new arrays without the removed image
    const newUploadedImages = [...uploadedImages];
    const newImagesBase64 = [...imagesBase64];
    newUploadedImages.splice(index, 1);
    newImagesBase64.splice(index, 1);

    // Update state
    setUploadedImages(newUploadedImages);
    setImagesBase64(newImagesBase64);

    // If the removed image was the main image, set the first image as the main image
    if (formData.imageUrl === removedBase64) {
      setFormData(prev => ({ ...prev, imageUrl: newImagesBase64[0] }));
    }

    // Revoke the object URL to free up memory
    URL.revokeObjectURL(removedUrl);
  };

  const handleSetMainImage = (index: number) => {
    const base64 = imagesBase64[index];
    setFormData(prev => ({ ...prev, imageUrl: base64 }));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await deleteProduct(id);
        setSnackbarMessage('Product deleted successfully!');
        setSnackbarType('success');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error deleting product:', error);
        setSnackbarMessage('Failed to delete product. Please try again.');
        setSnackbarType('error');
        setSnackbarOpen(true);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadedImages.length === 0) {
      alert('Please upload at least one product image.');
      return;
    }

    if (imagesBase64.length === 0) {
      alert('Please wait for the images to finish processing.');
      return;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      imageUrl: formData.imageUrl || imagesBase64[0]
    };

    const productToSave = {
      ...productData,
      id: editingProduct ? editingProduct.id : undefined, // Let backend generate ID for new products
      rating: editingProduct ? editingProduct.rating : 5,
      reviewCount: editingProduct ? editingProduct.reviewCount : 0,
      images: imagesBase64
    };

    try {
      await saveProduct(productToSave);

      // Set snackbar state before changing form visibility
      setSnackbarMessage(`Product ${editingProduct ? 'updated' : 'created'} successfully!`);
      setSnackbarType('success');
      setSnackbarOpen(true);

      // Use setTimeout to ensure state updates are processed before hiding the form
      setTimeout(() => {
        setShowProductForm(false);
      }, 100);
    } catch (error) {
      console.error('Error saving product:', error);
      setSnackbarMessage('Failed to save product. Please try again.');
      setSnackbarType('error');
      setSnackbarOpen(true);
    }
  };

  // Cleanup function for uploaded images
  React.useEffect(() => {
    return () => {
      uploadedImages.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [uploadedImages]);

  const handleCancel = () => {
    setShowProductForm(false);
  };

  if (showProductForm) {
    return (
      <div>
        <Snackbar
          isOpen={snackbarOpen}
          message={snackbarMessage}
          type={snackbarType}
          onClose={() => setSnackbarOpen(false)}
        />
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-brand-gray-900">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h1>
          <button 
            onClick={handleCancel} 
            className="bg-brand-gray-200 hover:bg-brand-gray-300 text-brand-gray-800 font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Icon name="x" className="w-5 h-5" />
            Cancel
          </button>
        </div>

        <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-brand-gray-100 p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-brand-gray-700">Product Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-brand-gray-700">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-brand-gray-700">Price</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-brand-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="pl-7 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-brand-gray-700">Category</label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="stockStatus" className="block text-sm font-medium text-brand-gray-700">Stock Status</label>
                  <select
                    id="stockStatus"
                    name="stockStatus"
                    value={formData.stockStatus}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>

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
                  <div className="mt-2">
                    <p className="text-sm font-medium text-brand-gray-700 mb-2">Image Previews</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {uploadedImages.map((url, index) => (
                        <div key={index} className={`relative group border-2 rounded-lg overflow-hidden ${formData.imageUrl === imagesBase64[index] ? 'border-techflex-blue' : 'border-brand-gray-200'}`}>
                          <img 
                            src={url} 
                            alt={`Product preview ${index + 1}`} 
                            className="h-24 w-full object-cover"
                            onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Image+Error'}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              type="button" 
                              onClick={() => handleSetMainImage(index)} 
                              title="Set as main" 
                              className="p-1 bg-white rounded-full text-brand-gray-800 mr-2"
                            >
                              <Icon name="star" className="w-4 h-4" />
                            </button>
                            <button 
                              type="button" 
                              onClick={() => handleRemoveImage(index)} 
                              title="Remove" 
                              className="p-1 bg-white rounded-full text-red-600"
                            >
                              <Icon name="trash" className="w-4 h-4" />
                            </button>
                          </div>
                          {formData.imageUrl === imagesBase64[index] && (
                            <div className="absolute top-1 right-1 bg-techflex-blue text-white rounded-full p-1">
                              <Icon name="check" className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="mr-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-brand-gray-700 bg-brand-gray-200 hover:bg-brand-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-techflex-blue hover:bg-techflex-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-techflex-blue"
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Snackbar
        isOpen={snackbarOpen}
        message={snackbarMessage}
        type={snackbarType}
        onClose={() => setSnackbarOpen(false)}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-gray-900">Products</h1>
        <button onClick={handleAddNew} className="bg-techflex-blue-500 hover:bg-techflex-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 transition-colors">
          <Icon name="plus" className="w-5 h-5" />
          Add
        </button>
      </div>
      <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-brand-gray-100">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-brand-gray-200">
            <thead className="bg-brand-gray-50">
                <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">Product</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">Stock</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-brand-gray-200">
                {products.map(product => (
                <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-md object-cover" src={product.imageUrl} alt={product.name} />
                        </div>
                        <div className="ml-4">
                        <div className="text-sm font-medium text-brand-gray-900">{product.name}</div>
                        </div>
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray-500">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray-500">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.stockStatus === 'In Stock' ? 'bg-green-100 text-green-800' : 
                        product.stockStatus === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                        {product.stockStatus || 'N/A'}
                    </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(product.id)} className="text-techflex-blue hover:text-techflex-blue-700 mr-4 font-semibold">Edit</button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800 font-semibold">Delete</button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProductsPage;
