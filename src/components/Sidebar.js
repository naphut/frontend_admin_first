import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  CubeIcon,
  Cog6ToothIcon,
  PhotoIcon,
  ArrowLeftOnRectangleIcon,
  ChartBarIcon,
  UserGroupIcon,
  TagIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();
  const [expanded, setExpanded] = useState(true);

  const navigation = [
    { 
      name: 'Dashboard', 
      to: '/dashboard', 
      icon: HomeIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      name: 'Products', 
      to: '/products', 
      icon: CubeIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      name: 'Slideshow', 
      to: '/slideshow', 
      icon: PhotoIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      name: 'Analytics', 
      to: '/analytics', 
      icon: ChartBarIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      badge: 'New'
    },
    { 
      name: 'Customers', 
      to: '/customers', 
      icon: UserGroupIcon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    { 
      name: 'Categories', 
      to: '/categories', 
      icon: TagIcon,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    { 
      name: 'Orders', 
      to: '/orders', 
      icon: ShoppingCartIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      badge: '3'
    },
    { 
      name: 'Settings', 
      to: '/settings', 
      icon: Cog6ToothIcon,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    },
  ];

  return (
    <div className={`${expanded ? 'w-64' : 'w-20'} bg-gradient-to-b from-white to-gray-50 shadow-xl transition-all duration-300 ease-in-out border-r border-gray-200`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-white">
          <div className={`flex items-center ${!expanded && 'justify-center'}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            {expanded && (
              <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                Admin Panel
              </h1>
            )}
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item, index) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `group relative flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] ${
                  isActive
                    ? `${item.bgColor} ${item.color} shadow-sm`
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`flex items-center ${!expanded && 'justify-center w-full'}`}>
                <item.icon className={`w-5 h-5 ${expanded ? 'mr-3' : ''} transition-transform group-hover:scale-110`} />
                {expanded && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                        item.badge === 'New' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </div>
              
              {/* Tooltip for collapsed state */}
              {!expanded && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.name}
                  {item.badge && (
                    <span className="ml-1 text-yellow-400">{item.badge}</span>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Info */}
        {expanded && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@example.com</p>
              </div>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <button
            onClick={logout}
            className={`flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200 group ${
              !expanded ? 'justify-center' : ''
            }`}
          >
            <ArrowLeftOnRectangleIcon className={`w-5 h-5 ${expanded ? 'mr-3' : ''} transition-transform group-hover:scale-110`} />
            {expanded && <span>Logout</span>}
            
            {/* Tooltip for collapsed state */}
            {!expanded && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                Logout
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;