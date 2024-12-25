import React, { useEffect, useState } from 'react';
import { 
  Bold, Italic, Underline, Heading1, Heading2, Heading3,
  Quote, List, ListOrdered
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface FloatingToolbarProps {
  onFormatClick: (command: string, value?: string) => void;
  getFormat: (format: string) => boolean;
}

export function FloatingToolbar({ onFormatClick, getFormat }: FloatingToolbarProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !selection.rangeCount) {
        setIsVisible(false);
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      if (rect.width === 0) {
        setIsVisible(false);
        return;
      }

      // Position the toolbar above the selection
      setPosition({
        top: rect.top - 50 + window.scrollY, // 50px above selection
        left: rect.left + (rect.width / 2) - 150 // Centered horizontally
      });
      
      setIsVisible(true);
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1.5 flex items-center space-x-1"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateX(-50%)',
      }}
    >
      <div className="flex space-x-1">
        <button
          type="button"
          onClick={() => onFormatClick('bold')}
          className={cn(
            "p-1.5 rounded hover:bg-gray-100",
            getFormat('bold') && "bg-gray-100"
          )}
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onFormatClick('italic')}
          className={cn(
            "p-1.5 rounded hover:bg-gray-100",
            getFormat('italic') && "bg-gray-100"
          )}
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onFormatClick('underline')}
          className={cn(
            "p-1.5 rounded hover:bg-gray-100",
            getFormat('underline') && "bg-gray-100"
          )}
        >
          <Underline className="h-4 w-4" />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-200" />

      <div className="flex space-x-1">
        <button
          type="button"
          onClick={() => onFormatClick('formatBlock', '<h1>')}
          className="p-1.5 rounded hover:bg-gray-100"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onFormatClick('formatBlock', '<h2>')}
          className="p-1.5 rounded hover:bg-gray-100"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onFormatClick('formatBlock', '<h3>')}
          className="p-1.5 rounded hover:bg-gray-100"
        >
          <Heading3 className="h-4 w-4" />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-200" />

      <div className="flex space-x-1">
        <button
          type="button"
          onClick={() => onFormatClick('insertUnorderedList')}
          className={cn(
            "p-1.5 rounded hover:bg-gray-100",
            getFormat('insertUnorderedList') && "bg-gray-100"
          )}
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onFormatClick('insertOrderedList')}
          className={cn(
            "p-1.5 rounded hover:bg-gray-100",
            getFormat('insertOrderedList') && "bg-gray-100"
          )}
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onFormatClick('formatBlock', '<blockquote>')}
          className="p-1.5 rounded hover:bg-gray-100"
        >
          <Quote className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}