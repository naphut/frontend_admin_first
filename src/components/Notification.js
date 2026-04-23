import React, { useState, useEffect } from 'react';
import { 
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Notification = ({ 
  type = 'info', 
  title, 
  message, 
  duration = 5000, 
  onClose,
  action 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  const typeConfig = {
    success: {
      icon: CheckCircleIcon,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      titleColor: 'text-green-900',
      messageColor: 'text-green-700'
    },
    error: {
      icon: XCircleIcon,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      titleColor: 'text-red-900',
      messageColor: 'text-red-700'
    },
    warning: {
      icon: ExclamationCircleIcon,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-900',
      messageColor: 'text-yellow-700'
    },
    info: {
      icon: InformationCircleIcon,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900',
      messageColor: 'text-blue-700'
    }
  };

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  if (!isVisible) return null;

  return (
    <div className={`max-w-sm w-full transform transition-all duration-300 ${
      isLeaving ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
    }`}>
      <div className={`${config.bgColor} ${config.borderColor} border rounded-xl shadow-lg p-4`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`w-6 h-6 ${config.iconColor}`} />
          </div>
          <div className="ml-3 flex-1">
            {title && (
              <p className={`text-sm font-medium ${config.titleColor}`}>
                {title}
              </p>
            )}
            {message && (
              <p className={`text-sm ${config.messageColor} ${title ? 'mt-1' : ''}`}>
                {message}
              </p>
            )}
            {action && (
              <div className="mt-3">
                <button
                  onClick={action.onClick}
                  className={`text-sm font-medium ${config.titleColor} hover:underline`}
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={handleClose}
              className={`inline-flex rounded-md p-1.5 hover:bg-opacity-20 hover:bg-gray-900 transition-colors`}
            >
              <XMarkIcon className={`w-4 h-4 ${config.iconColor}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Notification Container
export const NotificationContainer = ({ notifications, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={() => onRemove(notification.id)}
        />
      ))}
    </div>
  );
};

// Quick notification helpers
export const showSuccess = (title, message, duration = 5000) => ({
  id: Date.now(),
  type: 'success',
  title,
  message,
  duration
});

export const showError = (title, message, duration = 0) => ({
  id: Date.now(),
  type: 'error',
  title,
  message,
  duration
});

export const showWarning = (title, message, duration = 5000) => ({
  id: Date.now(),
  type: 'warning',
  title,
  message,
  duration
});

export const showInfo = (title, message, duration = 5000) => ({
  id: Date.now(),
  type: 'info',
  title,
  message,
  duration
});

export default Notification;
