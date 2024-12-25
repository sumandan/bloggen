import React, { useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { generateBlogPost } from '../../lib/ai';
import { RichTextEditor } from '../editor/RichTextEditor';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { ShortcutsHelp } from '../ui/ShortcutsHelp';
import { InteractiveArea } from '../ui/InteractiveArea';
import { Toast } from '../ui/Toast';

interface BlogGeneratorProps {
  onGenerated: (title: string, content: string) => void;
  onClose: () => void;
}

export function BlogGenerator({ onGenerated, onClose }: BlogGeneratorProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [step, setStep] = useState<'input' | 'preview'>('input');
  const [validationErrors, setValidationErrors] = useState({
    title: '',
    description: ''
  });

  const handleContinue = () => {
    setStep('preview');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset validation errors
    setValidationErrors({ title: '', description: '' });
    
    // Validate inputs
    let hasErrors = false;
    if (!title.trim()) {
      setValidationErrors(prev => ({ ...prev, title: 'Title is required' }));
      hasErrors = true;
    } else if (title.length < 5) {
      setValidationErrors(prev => ({ ...prev, title: 'Title must be at least 5 characters' }));
      hasErrors = true;
    }
    
    if (!description.trim()) {
      setValidationErrors(prev => ({ ...prev, description: 'Description is required' }));
      hasErrors = true;
    } else if (description.length < 20) {
      setValidationErrors(prev => ({ 
        ...prev, 
        description: 'Description must be at least 20 characters' 
      }));
      hasErrors = true;
    }
    
    if (hasErrors) return;

    setIsGenerating(true);
    setError(null);

    const response = await generateBlogPost(title, description);
    
    if (response.success && response.content) {
      setGeneratedContent(response.content);
      setToastMessage('Content generated successfully!');
      setToastType('success');
      setShowToast(true);
      setStep('preview');
    } else {
      setError(response.error || 'Failed to generate blog post');
      setToastMessage(response.error || 'Failed to generate blog post');
      setToastType('error');
      setShowToast(true);
    }
    
    setIsGenerating(false);
  };

  const handleSave = () => {
    onGenerated(title, generatedContent);
    setToastMessage('Blog post saved successfully!');
    setToastType('success');
    setShowToast(true);
    onClose();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    // Generate content with Ctrl+Enter
    if (e.ctrlKey && e.key === 'Enter' && !isGenerating) {
      e.preventDefault();
      handleSubmit(e as any);
    }
    // Close dialog with Escape
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isGenerating]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-hidden">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 relative">
          <h2 className="text-xl font-semibold">Generate Blog Post</h2>
          <div className="flex items-center space-x-2">
            <ShortcutsHelp />
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
              aria-label="Close generator"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {step === 'input' ? (
          <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-2">
          <InteractiveArea isEditable>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Blog Post Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your blog post title"
              disabled={isGenerating}
              className={cn(
                "w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500",
                validationErrors.title ? "border-red-300" : "border-gray-300"
              )}
            />
            {validationErrors.title && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
            )}
          </InteractiveArea>

          <InteractiveArea isEditable>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Brief Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a 2-3 sentence overview of your topic"
              rows={3}
              disabled={isGenerating}
              className={cn(
                "w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500",
                validationErrors.description ? "border-red-300" : "border-gray-300"
              )}
            />
            {validationErrors.description && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
            )}
          </InteractiveArea>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!title.trim() || !description.trim() || isGenerating}
              isLoading={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Post'}
            </Button>
          </div>
          </form>
        ) : (
          <div className="space-y-4 overflow-y-auto flex-1 pr-2">
            <div className="border-b pb-4">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            </div>
            
            <div className="prose prose-sm max-w-none overflow-y-auto">
              <div dangerouslySetInnerHTML={{ __html: generatedContent }} />
            </div>
            
          </div>
        )}
        <div className="flex justify-end space-x-3 pt-4 mt-4 border-t">
          {step === 'preview' ? (
            <>
              <Button
                variant="secondary"
                onClick={() => setStep('input')}
              >
                Back to Edit
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 focus:ring-green-500"
              >
                Save Post
              </Button>
            </>
          ) : null}
        </div>
      </div>
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}