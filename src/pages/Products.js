import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { PencilIcon, TrashIcon, PlusIcon, CheckIcon, XMarkIcon, EyeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(id);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setEditForm({
      name: product.name,
      price: product.price,
      original_price: product.original_price,
      category: product.category,
      in_stock: product.in_stock,
      brand: product.brand
    });
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setEditForm({});
  };

  const handleSave = async (productId) => {
    setSaving(true);
    try {
      const formData = new FormData();
      Object.keys(editForm).forEach(key => {
        if (editForm[key] !== undefined && editForm[key] !== null) {
          formData.append(key, editForm[key]);
        }
      });

      await productsAPI.update(productId, formData);
      toast.success('Product updated successfully');
      setEditingProduct(null);
      setEditForm({});
      fetchProducts();
    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category))];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Products Management</h1>
            <p className="text-blue-100">Manage your product inventory</p>
          </div>
          <Link
            to="/products/add"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center shadow-lg"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Product
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
          <div className="text-2xl font-bold text-gray-900">{products.length}</div>
          <div className="text-sm text-gray-500">Total Products</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
          <div className="text-2xl font-bold text-green-600">
            {products.filter(p => p.in_stock).length}
          </div>
          <div className="text-sm text-gray-500">In Stock</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
          <div className="text-2xl font-bold text-red-600">
            {products.filter(p => !p.in_stock).length}
          </div>
          <div className="text-sm text-gray-500">Out of Stock</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
          <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
          <div className="text-sm text-gray-500">Categories</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <EyeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <div className="flex items-center text-sm text-gray-600">
            {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img
                          className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                          src={`${process.env.REACT_APP_API_URL}/${product.main_image}`}
                          alt={product.name}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        {editingProduct === product.id ? (
                          <input
                            type="text"
                            value={editForm.name || ''}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="text-sm font-medium text-gray-900 border-b border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        ) : (
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                        )}
                        {editingProduct === product.id ? (
                          <input
                            type="text"
                            value={editForm.brand || ''}
                            onChange={(e) => handleInputChange('brand', e.target.value)}
                            className="text-sm text-gray-500 border-b border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 mt-1"
                          />
                        ) : (
                          <div className="text-sm text-gray-500">
                            {product.brand}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {editingProduct === product.id ? (
                      <input
                        type="text"
                        value={editForm.category || ''}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="px-2 py-1 text-xs border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingProduct === product.id ? (
                      <div className="space-y-1">
                        <input
                          type="number"
                          step="0.01"
                          value={editForm.price || ''}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          className="w-20 text-sm font-medium text-gray-900 border-b border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <input
                          type="number"
                          step="0.01"
                          value={editForm.original_price || ''}
                          onChange={(e) => handleInputChange('original_price', e.target.value)}
                          placeholder="Original price"
                          className="w-20 text-xs text-gray-500 border-b border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm font-medium text-gray-900">${product.price}</div>
                        {product.original_price && (
                          <div className="text-sm text-gray-500 line-through">
                            ${product.original_price}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingProduct === product.id ? (
                      <select
                        value={editForm.in_stock !== undefined ? editForm.in_stock : product.in_stock}
                        onChange={(e) => handleInputChange('in_stock', e.target.value === 'true')}
                        className="px-2 py-1 text-xs border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="true">In Stock</option>
                        <option value="false">Out of Stock</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.in_stock 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      {product.rating} ({product.reviews})
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {editingProduct === product.id ? (
                        <>
                          <button
                            onClick={() => handleSave(product.id)}
                            disabled={saving}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                            title="Save"
                          >
                            {saving ? (
                              <div className="animate-spin h-4 w-4 border-b-2 border-green-600 rounded-full"></div>
                            ) : (
                              <CheckIcon className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50 transition-colors"
                            title="Cancel"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                            title="Edit"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <Link
                            to={`/products/edit/${product.id}`}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors"
                            title="Full Edit"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No products found</div>
            <div className="text-gray-400 text-sm mt-2">
              Try adjusting your search or filter criteria
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;