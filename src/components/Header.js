import React from 'react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Welcome back, {user?.full_name || user?.username}!
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'A'}
            </div>
            <span className="text-sm text-gray-600">{user?.email}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;