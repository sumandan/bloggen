import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { cn } from '../../lib/utils';
import { RichTextEditor } from '../editor/RichTextEditor';
import { enhanceBlogContent } from '../../lib/ai';
import { uploadImage } from '../../lib/storage';
import { ImageUpload } from '../ui/ImageUpload';
import { decodeHtmlEntities } from '../../lib/utils';

interface BlogFormData {
  title: string;
  content: string;
  featured_image?: string;
}

interface BlogFormProps {
  initialData?: BlogFormData;
  isOpen: boolean;
  mode?: 'create' | 'edit' | 'generate' | null;
  onClose: () => void;
  onSubmit: (data: BlogFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function BlogForm({ initialData, isOpen, mode, onClose, onSubmit, isSubmitting }: BlogFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm<BlogFormData>({
    defaultValues: initialData || {
      title: '',
      content: '',
      featured_image: ''
    }
  });

  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhanceError, setEnhanceError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [content, setContent] = useState('');

  // Update content when initialData changes
  React.useEffect(() => {
    if (initialData?.content) {
      setContent(initialData.content);
    }
  }, [initialData]);

  // Update form values when initialData changes
  React.useEffect(() => {
    if (initialData) {
      setValue('title', initialData.title);
      setValue('content', initialData.content || '');
      setValue('featured_image', initialData.featured_image || '');
    }
  }, [initialData, setValue, setContent]);

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setValue('featured_image', imageUrl, { shouldDirty: true });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEnhanceContent = async () => {
    const content = getValues('content');
    if (!content) return;

    setIsEnhancing(true);
    setEnhanceError(null);

    const response = await enhanceBlogContent(content);
    if (response.success && response.content) {
      setValue('content', response.content, { shouldDirty: true });
    } else {
      setEnhanceError(response.error || 'Failed to enhance content');
    }

    setIsEnhancing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-20">
          <h2 className="text-lg font-semibold">
            {initialData ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Close form"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 max-h-[calc(100vh-10rem)] overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image
              </label>
              <ImageUpload
                onImageSelect={handleImageUpload}
                currentImage={getValues('featured_image')}
                onImageRemove={() => setValue('featured_image', '', { shouldDirty: true })}
                className={cn(isUploading && "opacity-50 pointer-events-none")}
              />
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                {...register('title', { required: 'Title is required' })}
                className={cn(
                  "mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                  errors.title && "border-red-300"
                )}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <div className="relative mt-1">
                <div className="relative">
                  <RichTextEditor
                    value={content}
                    onChange={(value) => {
                      setContent(value);
                      setValue('content', value, { shouldDirty: true });
                    }}
                    onEnhance={async (instructions) => {
                      setIsEnhancing(true);
                      setEnhanceError(null);
                      
                      const response = await enhanceBlogContent(content, instructions);
                      if (response.success && response.content) {
                        setValue('content', response.content, { shouldDirty: true });
                        setContent(response.content);
                      } else {
                        setEnhanceError(response.error || 'Failed to enhance content');
                      }
                      
                      setIsEnhancing(false);
                    }}
                    isEnhancing={isEnhancing}
                    error={errors.content?.message}
                  />
                </div>
              </div>
              {enhanceError && (
                <p className="mt-1 text-sm text-red-600">{enhanceError}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                  isSubmitting && "opacity-50 cursor-not-allowed"
                )}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}