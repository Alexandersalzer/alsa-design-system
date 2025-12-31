'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = { id, message, type };
    
    setToasts(prev => [...prev, newToast]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={hideToast} />
    </ToastContext.Provider>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      pointerEvents: 'none',
    }}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onClose: (id: string) => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const [isExiting, setIsExiting] = React.useState(false);
  const [translateX, setTranslateX] = React.useState(400);
  const [opacity, setOpacity] = React.useState(0);

  React.useEffect(() => {
    // Slide in animation
    requestAnimationFrame(() => {
      setTranslateX(0);
      setOpacity(1);
    });
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTranslateX(400);
    setOpacity(0);
    setTimeout(() => onClose(toast.id), 300);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return '✓';
      case 'error': return '✗';
      case 'warning': return '⚠';
      case 'info': return 'ⓘ';
      default: return '✓';
    }
  };

  const getColors = () => {
    switch (toast.type) {
      case 'success': return { bg: '#10b981', border: '#059669' };
      case 'error': return { bg: '#ef4444', border: '#dc2626' };
      case 'warning': return { bg: '#f59e0b', border: '#d97706' };
      case 'info': return { bg: '#3b82f6', border: '#2563eb' };
      default: return { bg: '#10b981', border: '#059669' };
    }
  };

  const colors = getColors();

  return (
    <div 
      style={{
        background: colors.bg,
        color: 'white',
        padding: '16px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minWidth: '300px',
        maxWidth: '500px',
        pointerEvents: 'auto',
        cursor: 'pointer',
        border: `1px solid ${colors.border}`,
        transform: `translateX(${translateX}px)`,
        opacity,
        transition: 'all 0.3s ease-out',
      }}
      onClick={handleClose}
    >
      <div style={{ fontSize: '20px', fontWeight: 'bold', flexShrink: 0 }}>
        {getIcon()}
      </div>
      <div style={{ flex: 1, fontSize: '14px', lineHeight: '1.4', fontWeight: 500 }}>
        {toast.message}
      </div>
      <button 
        style={{
          background: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '24px',
          lineHeight: 1,
          cursor: 'pointer',
          padding: 0,
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.8,
          flexShrink: 0,
        }}
        onClick={handleClose}
        aria-label="Close"
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
      >
        ×
      </button>
    </div>
  );
}
