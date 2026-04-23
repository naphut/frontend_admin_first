import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Settings from './pages/Settings';
import Slideshow from './pages/Slideshow';

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* Modern Toast Configuration */}
        <Toaster 
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1a1a',
              color: '#fff',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            },
            success: {
              style: {
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#10b981',
              },
            },
            error: {
              style: {
                background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#ef4444',
              },
            },
            loading: {
              style: {
                background: 'linear-gradient(135deg, #4b5563 0%, #6b7280 100%)',
              },
            },
          }}
        />
        
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="slideshow" element={<Slideshow />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

// Modern 404 Component
const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="relative">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="w-64 h-64 bg-primary-200 rounded-full blur-3xl"></div>
          </div>
        </div>
        
        <h2 className="text-3xl font-semibold text-gray-900 mt-8 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 text-gray-700 bg-white rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200 font-medium"
          >
            Go Back
          </button>
          
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl shadow-sm hover:shadow-md hover:from-primary-700 hover:to-primary-600 transition-all duration-200 font-medium"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;