import React, { useEffect, useState } from 'react';
import Icon from './Icon';

export type SnackbarType = 'success' | 'error' | 'info' | 'warning';

interface SnackbarProps {
  open: boolean;
  message: string;
  type?: SnackbarType;
  duration?: number;
  onClose: () => void;
}

const Snackbar: React.FC<SnackbarProps> = ({
  open,
  message,
  type = 'info',
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(open);

  useEffect(() => {
    setIsVisible(open);
    
    if (open && duration !== Infinity) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  if (!isVisible) return null;

  const getTypeStyles = (): string => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-500 text-green-700';
      case 'error':
        return 'bg-red-100 border-red-500 text-red-700';
      case 'warning':
        return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      case 'info':
      default:
        return 'bg-blue-100 border-blue-500 text-blue-700';
    }
  };

  const getIcon = (): string => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'x-circle';
      case 'warning':
        return 'exclamation';
      case 'info':
      default:
        return 'information-circle';
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
      <div className={`flex items-center p-4 mb-4 border-l-4 rounded-lg shadow-md ${getTypeStyles()}`} role="alert">
        <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 mr-3">
          <Icon name={getIcon()} className="w-5 h-5" />
        </div>
        <div className="ml-3 text-sm font-medium">
          {message}
        </div>
        <button
          type="button"
          className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 focus:ring-2 focus:outline-none ${
            type === 'success' ? 'hover:bg-green-200 focus:ring-green-400' :
            type === 'error' ? 'hover:bg-red-200 focus:ring-red-400' :
            type === 'warning' ? 'hover:bg-yellow-200 focus:ring-yellow-400' :
            'hover:bg-blue-200 focus:ring-blue-400'
          }`}
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
        >
          <span className="sr-only">Close</span>
          <Icon name="x" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Snackbar;