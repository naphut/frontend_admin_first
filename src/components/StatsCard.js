import React from 'react';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  CubeIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

const StatsCard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  color = 'blue',
  trend = 'up',
  subtitle = ''
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    pink: 'bg-pink-50 text-pink-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  const trendColor = changeType === 'increase' ? 'text-green-600' : 'text-red-600';
  const TrendIcon = changeType === 'increase' ? ArrowUpIcon : ArrowDownIcon;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 mb-2">{subtitle}</p>
            )}
            {change && (
              <div className={`flex items-center text-sm ${trendColor}`}>
                <TrendIcon className="w-4 h-4 mr-1" />
                <span className="font-medium">{change}</span>
                <span className="text-gray-500 ml-1">from last month</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${colorClasses[color]} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
      {/* Progress bar */}
      {change && (
        <div className="h-1 bg-gray-100">
          <div 
            className={`h-full ${
              changeType === 'increase' ? 'bg-green-500' : 'bg-red-500'
            } transition-all duration-500`}
            style={{ 
              width: `${Math.min(Math.abs(parseFloat(change)) * 10, 100)}%` 
            }}
          />
        </div>
      )}
    </div>
  );
};

// Pre-configured stat cards
export const RevenueCard = ({ value, change }) => (
  <StatsCard
    title="Total Revenue"
    value={value}
    change={change}
    changeType={parseFloat(change) > 0 ? 'increase' : 'decrease'}
    icon={CurrencyDollarIcon}
    color="green"
  />
);

export const OrdersCard = ({ value, change }) => (
  <StatsCard
    title="Total Orders"
    value={value}
    change={change}
    changeType={parseFloat(change) > 0 ? 'increase' : 'decrease'}
    icon={ShoppingCartIcon}
    color="blue"
  />
);

export const CustomersCard = ({ value, change }) => (
  <StatsCard
    title="Total Customers"
    value={value}
    change={change}
    changeType={parseFloat(change) > 0 ? 'increase' : 'decrease'}
    icon={UserGroupIcon}
    color="indigo"
  />
);

export const ProductsCard = ({ value, change }) => (
  <StatsCard
    title="Total Products"
    value={value}
    change={change}
    changeType={parseFloat(change) > 0 ? 'increase' : 'decrease'}
    icon={CubeIcon}
    color="purple"
  />
);

export const SlideshowCard = ({ value, change }) => (
  <StatsCard
    title="Active Slides"
    value={value}
    change={change}
    changeType={parseFloat(change) > 0 ? 'increase' : 'decrease'}
    icon={PhotoIcon}
    color="orange"
    subtitle="Homepage slideshow"
  />
);

export default StatsCard;
