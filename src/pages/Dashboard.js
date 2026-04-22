import React, { useEffect, useState } from 'react';
import { productsAPI } from '../services/api';
import {
  CurrencyDollarIcon,
  CubeIcon,
  StarIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';

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

  const statCards = [
    {
      name: 'Total Products',
      value: stats.totalProducts,
      icon: CubeIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Total Value',
      value: `$${stats.totalValue.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'bg-green-500'
    },
    {
      name: 'Average Rating',
      value: stats.averageRating,
      icon: StarIcon,
      color: 'bg-yellow-500'
    },
    {
      name: 'Out of Stock',
      value: stats.outOfStock,
      icon: ShoppingBagIcon,
      color: 'bg-red-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Products</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentProducts.map((product) => (
            <div key={product.id} className="px-6 py-4 flex items-center">
              <img
                src={`http://localhost:8000/${product.main_image}`}
                alt={product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="ml-4 flex-1">
                <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.brand}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">${product.price}</p>
                <p className={`text-xs ${product.in_stock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.in_stock ? 'In Stock' : 'Out of Stock'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;