import React, { useEffect, useState } from 'react';
import { productsAPI, slideshowAPI } from '../services/api';
import {
  CurrencyDollarIcon,
  CubeIcon,
  StarIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import StatsCard, { 
  ProductsCard, 
  RevenueCard, 
  CustomersCard 
} from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { CardSkeleton } from '../components/LoadingSpinner';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    averageRating: 0,
    outOfStock: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await productsAPI.getAll({ limit: 5 });
      const products = response.data;
      
      setRecentProducts(products);
      
      // Calculate stats
      const totalProducts = products.length;
      const totalValue = products.reduce((sum, p) => sum + p.price, 0);
      const averageRating = products.reduce((sum, p) => sum + p.rating, 0) / totalProducts || 0;
      const outOfStock = products.filter(p => !p.in_stock).length;

      setStats({
        totalProducts,
        totalValue,
        averageRating: averageRating.toFixed(1),
        outOfStock
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to your admin dashboard</p>
        </div>
        <CardSkeleton count={4} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>
      
      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <ProductsCard 
          value={stats.totalProducts} 
          change="+12%" 
        />
        <RevenueCard 
          value={`$${stats.totalValue.toLocaleString()}`} 
          change="+8%" 
        />
        <StatsCard
          title="Average Rating"
          value={stats.averageRating}
          change="+0.3"
          changeType="increase"
          icon={StarIcon}
          color="yellow"
        />
        <StatsCard
          title="Out of Stock"
          value={stats.outOfStock}
          change="-2"
          changeType="decrease"
          icon={ShoppingBagIcon}
          color="red"
        />
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Products</h2>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {recentProducts.length} items
            </span>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {recentProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="px-6 py-4 flex items-center hover:bg-gray-50 transition-colors duration-200 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative">
                <img
                  src={product.main_image?.startsWith('http') 
                    ? product.main_image 
                    : `https://backend-ecommerce-vhi7.onrender.com${product.main_image}`}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                />
                {product.featured && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <StarIcon className="w-2 h-2 text-white" />
                  </div>
                )}
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-xs text-gray-500">{product.brand}</p>
                  <span className="text-gray-300">•</span>
                  <p className="text-xs text-gray-500">{product.category}</p>
                </div>
                {product.description && (
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                    {product.description}
                  </p>
                )}
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <p className="text-sm font-bold text-gray-900">${product.price}</p>
                  {product.original_price && product.original_price > product.price && (
                    <p className="text-xs text-gray-400 line-through">
                      ${product.original_price}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-end mt-1 space-x-2">
                  <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                    product.in_stock 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                  </span>
                  {product.rating > 0 && (
                    <div className="flex items-center">
                      <StarIcon className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {recentProducts.length === 0 && (
          <div className="px-6 py-12 text-center">
            <CubeIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No products found</p>
            <button className="mt-3 text-primary-600 text-sm hover:text-primary-700 font-medium">
              Add your first product
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;