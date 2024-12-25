import React from 'react';
import { cn } from '../../lib/utils';

interface ToolbarProps {
  children: React.ReactNode;
  className?: string;
}

export function Toolbar({ children, className }: ToolbarProps) {
  return (
    <div className={cn(
      "flex items-center space-x-1 p-1 border rounded-md bg-white",
      className
    )}>
      {children}
    </div>
  );
}