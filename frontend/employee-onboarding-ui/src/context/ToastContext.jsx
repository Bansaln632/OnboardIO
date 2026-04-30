import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { TOAST_DURATION } from '../constants';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, toast.duration || TOAST_DURATION.MEDIUM);

    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = useCallback((message, type = 'success', duration = TOAST_DURATION.MEDIUM) => {
    setToast({ message, type, duration });
  }, []);

  const showSuccess = useCallback((message, duration) => {
    showToast(message, 'success', duration);
  }, [showToast]);

  const showError = useCallback((message, duration) => {
    showToast(message, 'error', duration);
  }, [showToast]);

  const showInfo = useCallback((message, duration) => {
    showToast(message, 'info', duration);
  }, [showToast]);

  const showWarning = useCallback((message, duration) => {
    showToast(message, 'warning', duration);
  }, [showToast]);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider
      value={{
        toast,
        showToast,
        showSuccess,
        showError,
        showInfo,
        showWarning,
        dismissToast,
      }}
    >
      {children}
      {toast && <Toast {...toast} onDismiss={dismissToast} />}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

// Toast Component
const Toast = ({ message, type, onDismiss }) => {
  const getTypeClasses = () => {
    switch (type) {
      case 'success':
        return 'bg-success text-white';
      case 'error':
        return 'bg-error text-white';
      case 'warning':
        return 'bg-warning text-gray-900';
      case 'info':
        return 'bg-info text-white';
      default:
        return 'bg-gray-800 text-white';
    }
  };

  return (
    <div className={`
      fixed top-5 right-5 z-[9999]
      min-w-[250px] max-w-[400px]
      flex items-center gap-3
      px-5 py-3 rounded-lg shadow-strong
      animate-slide-in
      ${getTypeClasses()}
    `}>
      <span className="flex-1 text-sm font-medium">
        {message}
      </span>
      <button
        onClick={onDismiss}
        className="ml-2 p-0 bg-transparent border-none text-current text-xl cursor-pointer hover:opacity-80 transition-opacity"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};


