import React, { useState, useCallback, useRef, KeyboardEvent } from 'react';
import { 
  Bold, Italic, Underline, Heading1, Heading2, Heading3, 
  List, ListOrdered, Quote, AlignLeft, AlignCenter, AlignRight,
  Link2, Sparkles, Undo, Redo
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Toolbar } from './Toolbar';
import { FloatingToolbar } from './FloatingToolbar';
import { AIEnhanceModal } from './AIEnhanceModal';
import { useEditor } from '../../hooks/useEditor';
import { useEditorShortcuts } from '../../hooks/useEditorShortcuts';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onEnhance?: (instructions: string) => Promise<void>;
  isEnhancing?: boolean;
  error?: string;
  className?: string;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  onEnhance,
  isEnhancing,
  error, 
  className 
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showEnhanceModal, setShowEnhanceModal] = useState(false);
  const { 
    execCommand,
    getCurrentFormat,
    handleKeyCommand
  } = useEditor(editorRef, onChange);
  const handleKeyDown = useEditorShortcuts(execCommand);

  return (
    <div className="space-y-2">
      {onEnhance && (
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowEnhanceModal(true)}
            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Enhance with AI
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mb-2">
        <Toolbar>
          <div className="flex space-x-1">
            <button
              type="button"
              onClick={() => execCommand('undo')}
              className="p-2 hover:bg-gray-100 rounded"
              title={`Undo (${navigator.platform.includes('Mac') ? '⌘Z' : 'Ctrl+Z'})`}
            >
              <Undo className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => execCommand('redo')}
              className="p-2 hover:bg-gray-100 rounded"
              title={`Redo (${navigator.platform.includes('Mac') ? '⌘⇧Z' : 'Ctrl+Shift+Z'})`}
            >
              <Redo className="h-4 w-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-200 mx-2" />

          <div className="flex space-x-1">
            <button
              type="button"
              onClick={() => execCommand('bold')}
              className={cn(
                "p-2 hover:bg-gray-100 rounded",
                getCurrentFormat('bold') && "bg-gray-100"
              )}
              title="Bold (Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => execCommand('italic')}
              className={cn(
                "p-2 hover:bg-gray-100 rounded",
                getCurrentFormat('italic') && "bg-gray-100"
              )}
              title="Italic (Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => execCommand('underline')}
              className={cn(
                "p-2 hover:bg-gray-100 rounded",
                getCurrentFormat('underline') && "bg-gray-100"
              )}
              title="Underline (Ctrl+U)"
            >
              <Underline className="h-4 w-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-200 mx-2" />

          <div className="flex space-x-1">
            <button
              type="button"
              onClick={() => execCommand('formatBlock', '<h1>')}
              className="p-2 hover:bg-gray-100 rounded"
              title="Heading 1"
            >
              <Heading1 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => execCommand('formatBlock', '<h2>')}
              className="p-2 hover:bg-gray-100 rounded"
              title="Heading 2"
            >
              <Heading2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => execCommand('formatBlock', '<h3>')}
              className="p-2 hover:bg-gray-100 rounded"
              title="Heading 3"
            >
              <Heading3 className="h-4 w-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-200 mx-2" />
        
          <div className="flex space-x-1">
            <button
              type="button"
              onClick={() => execCommand('insertUnorderedList')}
              className={cn(
                "p-2 hover:bg-gray-100 rounded",
                getCurrentFormat('insertUnorderedList') && "bg-gray-100"
              )}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => execCommand('insertOrderedList')}
              className={cn(
                "p-2 hover:bg-gray-100 rounded",
                getCurrentFormat('insertOrderedList') && "bg-gray-100"
              )}
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => execCommand('formatBlock', '<blockquote>')}
              className="p-2 hover:bg-gray-100 rounded"
              title="Quote"
            >
              <Quote className="h-4 w-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-200 mx-2" />
        
          <div className="flex space-x-1">
            <button
              type="button"
              onClick={() => execCommand('justifyLeft')}
              className="p-2 hover:bg-gray-100 rounded"
              title="Align Left"
            >
              <AlignLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => execCommand('justifyCenter')}
              className="p-2 hover:bg-gray-100 rounded"
              title="Align Center"
            >
              <AlignCenter className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => execCommand('justifyRight')}
              className="p-2 hover:bg-gray-100 rounded"
              title="Align Right"
            >
              <AlignRight className="h-4 w-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-200 mx-2" />
        
          <div className="flex space-x-1">
            <button
              type="button"
              onClick={() => {
                const url = prompt('Enter URL:');
                if (url) {
                  execCommand('createLink', url);
                }
              }}
              className="p-2 hover:bg-gray-100 rounded"
              title="Insert Link"
            >
              <Link2 className="h-4 w-4" />
            </button>
          </div>
        </Toolbar>
      </div>
      
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className={cn(
          "min-h-[200px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 prose prose-sm max-w-none",
          error && "border-red-300",
          className
        )}
        onKeyDown={handleKeyDown}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        dangerouslySetInnerHTML={{ __html: value }}
      />
      <FloatingToolbar
        onFormatClick={execCommand}
        getFormat={getCurrentFormat}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      
      {onEnhance && (
        <AIEnhanceModal
          isOpen={showEnhanceModal}
          onClose={() => setShowEnhanceModal(false)}
          onEnhance={onEnhance}
          isEnhancing={isEnhancing || false}
        />
      )}
    </div>
  );
}