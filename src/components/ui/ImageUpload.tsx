import React, { useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  currentImage?: string;
  onImageRemove?: () => void;
  className?: string;
}

export function ImageUpload({ onImageSelect, currentImage, onImageRemove, className }: ImageUploadProps) {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  }, [onImageSelect]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  }, [onImageSelect]);

  return (
    <div className={cn("relative", className)}>
      {currentImage ? (
        <div className="relative rounded-lg overflow-hidden">
          <img 
            src={currentImage} 
            alt="Featured" 
            className="w-full h-48 object-cover"
          />
          {onImageRemove && (
            <button
              onClick={onImageRemove}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
              type="button"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-indigo-500 transition-colors"
        >
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">
            Drag and drop an image, or{' '}
            <label className="text-indigo-600 hover:text-indigo-500 cursor-pointer">
              browse
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
              />
            </label>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            PNG, JPG up to 10MB
          </p>
        </div>
      )}
    </div>
  );
}