import React, { useState } from 'react';
import { X, Sparkles, Wand2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

interface AIEnhanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnhance: (instructions: string) => Promise<void>;
  isEnhancing: boolean;
}

const ENHANCEMENT_PRESETS = [
  {
    label: 'Improve Clarity',
    description: 'Make the content clearer and easier to understand',
    instructions: 'Enhance the clarity and readability while maintaining the core message'
  },
  {
    label: 'Add Examples',
    description: 'Include relevant examples and illustrations',
    instructions: 'Add practical examples and illustrations to support the main points'
  },
  {
    label: 'Expand Content',
    description: 'Elaborate on key points with more detail',
    instructions: 'Expand the content with more detailed explanations and supporting information'
  },
  {
    label: 'Professional Tone',
    description: 'Adjust to a more professional writing style',
    instructions: 'Refine the tone to be more professional while maintaining engagement'
  }
];

export function AIEnhanceModal({ isOpen, onClose, onEnhance, isEnhancing }: AIEnhanceModalProps) {
  const [customInstructions, setCustomInstructions] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const handleEnhance = async () => {
    const instructions = selectedPreset || customInstructions;
    if (!instructions) return;
    
    await onEnhance(instructions);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 border border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Wand2 className="h-5 w-5 text-indigo-600" />
            <h2 className="text-xl font-semibold">Enhance with AI</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {ENHANCEMENT_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  setSelectedPreset(preset.instructions);
                  setCustomInstructions('');
                }}
                className={cn(
                  "p-4 text-left rounded-md border transition-all",
                  selectedPreset === preset.instructions
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                )}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  <span className="font-medium">{preset.label}</span>
                </div>
                <p className="text-sm text-gray-600">{preset.description}</p>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Custom Instructions
            </label>
            <textarea
              value={customInstructions}
              onChange={(e) => {
                setCustomInstructions(e.target.value);
                setSelectedPreset(null);
              }}
              placeholder="Or write your own enhancement instructions..."
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isEnhancing}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleEnhance}
              disabled={!selectedPreset && !customInstructions.trim() || isEnhancing}
              isLoading={isEnhancing}
            >
              {isEnhancing ? 'Enhancing...' : 'Enhance Content'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}