import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export function Toast({ 
  message, 
  type = 'success', 
  onClose, 
  duration = 3000 
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={cn(
      "fixed bottom-4 right-4 flex items-center p-4 rounded-lg shadow-lg transition-all transform",
      "animate-slide-up",
      type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
    )}>
      {type === 'success' ? (
        <CheckCircle className="w-5 h-5 mr-2" />
      ) : (
        <AlertCircle className="w-5 h-5 mr-2" />
      )}
      <p className="mr-4">{message}</p>
      <button
        onClick={onClose}
        className="ml-auto text-gray-400 hover:text-gray-500"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}