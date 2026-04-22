import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productsAPI } from '../services/api';
import ImageUpload from '../components/ImageUpload';
import { TrashIcon } from '@heroicons/react/24/outline';  // ADD THIS LINE
import toast from 'react-hot-toast';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
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
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productsAPI.getOne(id);
      const product = response.data;
      
      setFormData({
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        original_price: product.original_price || '',
        rating: product.rating,
        reviews: product.reviews,
        in_stock: product.in_stock,
        featured: product.featured,
        discount: product.discount || '0',
        colors: product.colors || [],
        storage: product.storage || [],
        description: product.description || '',
        specs: product.specs || {
          display: '',
          processor: '',
          camera: '',
          battery: '',
          water_resistant: ''
        }
      });

      setExistingImages(product.images || []);
    } catch (error) {
      toast.error('Failed to load product');
      navigate('/products');
    } finally {
      setFetchLoading(false);
    }
  };

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

  const handleDeleteImage = async (index) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await productsAPI.deleteImage(id, index);
        setExistingImages(prev => prev.filter((_, i) => i !== index));
        toast.success('Image deleted successfully');
      } catch (error) {
        toast.error('Failed to delete image');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    
    // Append all form fields
    Object.keys(formData).forEach(key => {
      if (key === 'specs') {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else if (key === 'colors' || key === 'storage') {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Append images
    if (mainImage) {
      formDataToSend.append('main_image', mainImage);
    }
    additionalImages.forEach(image => {
      formDataToSend.append('additional_images', image);
    });

    try {
      await productsAPI.update(id, formDataToSend);
      toast.success('Product updated successfully');
      navigate('/products');
    } catch (error) {
      toast.error('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Product</h1>
      
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
                value={formData.price}
                onChange={handleChange}
                className="input-field"
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
                value={formData.original_price}
                onChange={handleChange}
                className="input-field"
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
                placeholder="Black, White, Blue"
              />
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
                placeholder="128GB, 256GB, 512GB"
              />
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
              />
            </div>
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="md:col-span-2">
              <h3 className="text-md font-medium text-gray-900 mb-4">Existing Images</h3>
              <div className="grid grid-cols-4 gap-4">
                {existingImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={`http://localhost:8000/${image}`}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image Upload */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Update Images</h2>
            
            <ImageUpload
              label="New Main Image (leave empty to keep current)"
              onImageSelect={setMainImage}
              selectedImage={mainImage}
            />

            <ImageUpload
              label="New Additional Images"
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
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;