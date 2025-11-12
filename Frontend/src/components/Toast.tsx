import { useState, createContext, useContext, ReactNode } from 'react';
import './Toast.css';

interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [message, setMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showToast = (msg: string) => {
    setMessage(msg);
    setIsVisible(false);
    // Slight delay to trigger animation
    setTimeout(() => setIsVisible(true), 10);

    // Auto-hide after 2 seconds
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setMessage(null), 200);
    }, 2000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <div className={`toast ${isVisible ? 'show' : ''}`} role="status" aria-live="polite">
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
};
