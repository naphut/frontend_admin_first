import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import ImageUpload from '../components/ImageUpload';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    original_price: '',
    rating: '0',
    reviews: '0',
    in_stock: true,
    featured: false,
    discount: '0',
    colors: [],
    storage: [],
    description: '',
    specs: {
      display: '',
      processor: '',
      camera: '',
      battery: '',
      water_resistant: ''
    }
  });

  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('specs.')) {
      const specField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        specs: {
          ...prev.specs,
          [specField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleArrayChange = (field, values) => {
    setFormData(prev => ({
      ...prev,
      [field]: values
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return false;
    }
    if (!formData.brand.trim()) {
      toast.error('Brand is required');
      return false;
    }
    if (!formData.category.trim()) {
      toast.error('Category is required');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Valid price is required');
      return false;
    }
    if (!mainImage) {
      toast.error('Main image is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields with proper formatting
      console.log('=== FORM DATA BEING SENT ===');
      
      // Required fields
      formDataToSend.append('name', String(formData.name).trim());
      formDataToSend.append('brand', String(formData.brand).trim());
      formDataToSend.append('category', String(formData.category).trim());
      formDataToSend.append('price', String(parseFloat(formData.price) || 0));
      
      // Optional fields with defaults
      formDataToSend.append('original_price', formData.original_price ? String(parseFloat(formData.original_price)) : '');
      formDataToSend.append('rating', String(parseFloat(formData.rating) || 0));
      formDataToSend.append('reviews', String(parseInt(formData.reviews) || 0));
      formDataToSend.append('in_stock', String(formData.in_stock));
      formDataToSend.append('featured', String(formData.featured));
      formDataToSend.append('discount', String(parseInt(formData.discount) || 0));
      
      // JSON fields - ensure they are valid JSON strings
      const colorsJson = JSON.stringify(formData.colors || []);
      const storageJson = JSON.stringify(formData.storage || []);
      const specsJson = JSON.stringify(formData.specs || {});
      
      console.log('colors (JSON):', colorsJson);
      console.log('storage (JSON):', storageJson);
      console.log('specs (JSON):', specsJson);
      
      formDataToSend.append('colors', colorsJson);
      formDataToSend.append('storage', storageJson);
      formDataToSend.append('description', String(formData.description || ''));
      formDataToSend.append('specs', specsJson);

      // Append images
      console.log('main_image:', mainImage.name, mainImage.type, mainImage.size);
      formDataToSend.append('main_image', mainImage);
      
      console.log('additional_images count:', additionalImages.length);
      additionalImages.forEach((image, index) => {
        console.log(`additional_image_${index}:`, image.name, image.type, image.size);
        formDataToSend.append('additional_images', image);
      });

      // Log all FormData entries for debugging
      console.log('=== FORMDATA ENTRIES ===');
      for (let pair of formDataToSend.entries()) {
        if (pair[1] instanceof File) {
          console.log(pair[0], 'File:', pair[1].name, pair[1].type, pair[1].size);
        } else {
          console.log(pair[0], pair[1]);
        }
      }

      // Make the API call
      const response = await productsAPI.create(formDataToSend);
      console.log('Success response:', response.data);
      
      toast.success('Product added successfully');
      navigate('/products');
      
    } catch (error) {
      console.error('=== ERROR DETAILS ===');
      console.error('Error:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      
      // Show specific error message
      if (error.response?.data?.detail) {
        // Check if detail is an array of validation errors
        if (Array.isArray(error.response.data.detail)) {
          error.response.data.detail.forEach(err => {
            toast.error(`${err.loc.join('.')}: ${err.msg}`);
          });
        } else {
          toast.error(error.response.data.detail);
        }
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to add product. Please check all fields and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Add New Product</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="iPhone 15 Pro Max"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand *
              </label>
              <input
                type="text"
                name="brand"
                required
                value={formData.brand}
                onChange={handleChange}
                className="input-field"
                placeholder="Apple"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <input
                type="text"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="input-field"
                placeholder="smartphones"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                placeholder="Product description..."
              />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Pricing & Stock</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <input
                type="number"
                name="price"
                required
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                className="input-field"
                placeholder="1199.99"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Price
              </label>
              <input
                type="number"
                name="original_price"
                step="0.01"
                min="0"
                value={formData.original_price}
                onChange={handleChange}
                className="input-field"
                placeholder="1299.99"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount (%)
              </label>
              <input
                type="number"
                name="discount"
                min="0"
                max="100"
                value={formData.discount}
                onChange={handleChange}
                className="input-field"
                placeholder="8"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <input
                type="number"
                name="rating"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={handleChange}
                className="input-field"
                placeholder="4.8"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reviews Count
              </label>
              <input
                type="number"
                name="reviews"
                min="0"
                value={formData.reviews}
                onChange={handleChange}
                className="input-field"
                placeholder="2456"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="in_stock"
                  checked={formData.in_stock}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">In Stock</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Featured</span>
              </label>
            </div>
          </div>

          {/* Colors & Storage */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Colors & Storage</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Colors (comma separated)
              </label>
              <input
                type="text"
                value={formData.colors.join(', ')}
                onChange={(e) => handleArrayChange('colors', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                className="input-field"
                placeholder="Natural Titanium, Blue Titanium, White Titanium, Black Titanium"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter colors separated by commas
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Storage Options (comma separated)
              </label>
              <input
                type="text"
                value={formData.storage.join(', ')}
                onChange={(e) => handleArrayChange('storage', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                className="input-field"
                placeholder="256GB, 512GB, 1TB"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter storage options separated by commas
              </p>
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Specifications</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display
              </label>
              <input
                type="text"
                name="specs.display"
                value={formData.specs.display}
                onChange={handleChange}
                className="input-field"
                placeholder="6.7-inch Super Retina XDR display"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Processor
              </label>
              <input
                type="text"
                name="specs.processor"
                value={formData.specs.processor}
                onChange={handleChange}
                className="input-field"
                placeholder="A17 Pro chip"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Camera
              </label>
              <input
                type="text"
                name="specs.camera"
                value={formData.specs.camera}
                onChange={handleChange}
                className="input-field"
                placeholder="48MP Main | 12MP Ultra Wide | 12MP Telephoto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Battery
              </label>
              <input
                type="text"
                name="specs.battery"
                value={formData.specs.battery}
                onChange={handleChange}
                className="input-field"
                placeholder="Up to 29 hours video playback"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Water Resistant
              </label>
              <input
                type="text"
                name="specs.water_resistant"
                value={formData.specs.water_resistant}
                onChange={handleChange}
                className="input-field"
                placeholder="IP68"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Images</h2>
            
            <ImageUpload
              label="Main Image *"
              onImageSelect={setMainImage}
              selectedImage={mainImage}
            />

            <ImageUpload
              label="Additional Images"
              multiple
              onImagesSelect={setAdditionalImages}
              selectedImages={additionalImages}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;