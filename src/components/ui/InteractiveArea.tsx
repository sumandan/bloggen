import React from 'react';
import { cn } from '../../lib/utils';

interface InteractiveAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  isClickable?: boolean;
  isEditable?: boolean;
}

export function InteractiveArea({
  children,
  className,
  isClickable,
  isEditable,
  ...props
}: InteractiveAreaProps) {
  return (
    <div
      className={cn(
        'relative group transition-all duration-200',
        isClickable && 'cursor-pointer hover:bg-gray-50',
        isEditable && 'hover:ring-2 hover:ring-indigo-200',
        className
      )}
      {...props}
    >
      {children}
      {isEditable && (
        <div className="absolute inset-0 bg-indigo-500 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none" />
      )}
    </div>
  );
}