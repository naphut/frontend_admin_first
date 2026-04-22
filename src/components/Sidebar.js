import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  CubeIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
    { name: 'Products', to: '/products', icon: CubeIcon },
    { name: 'Settings', to: '/settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 border-b">
          <h1 className="text-xl font-bold text-primary-600">Admin Panel</h1>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;