import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AIButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export function AIButton({
  children,
  className,
  isLoading,
  variant = 'primary',
  size = 'md',
  disabled,
  ...props
}: AIButtonProps) {
  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2",
        // Variants
        variant === 'primary' && "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 focus:ring-indigo-500",
        variant === 'secondary' && "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus:ring-gray-500",
        // Sizes
        size === 'sm' && "px-3 py-1.5 text-sm",
        size === 'md' && "px-4 py-2 text-base",
        size === 'lg' && "px-6 py-3 text-lg",
        // States
        (disabled || isLoading) && "opacity-50 cursor-not-allowed",
        // Custom styles
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          {children}
        </>
      )}
      {/* Hover effect overlay */}
      <span className="absolute inset-0 rounded-lg bg-white opacity-0 hover:opacity-10 transition-opacity duration-200" />
    </button>
  );
}