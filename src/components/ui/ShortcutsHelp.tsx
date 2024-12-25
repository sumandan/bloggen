import React from 'react';
import { Keyboard } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ShortcutItem {
  keys: string[];
  description: string;
}

const EDITOR_SHORTCUTS: ShortcutItem[] = [
  { keys: ['Ctrl', 'B'], description: 'Bold text' },
  { keys: ['Ctrl', 'I'], description: 'Italic text' },
  { keys: ['Ctrl', 'U'], description: 'Underline text' },
  { keys: ['Tab'], description: 'Indent list' },
  { keys: ['Shift', 'Tab'], description: 'Unindent list' },
  { keys: ['Ctrl', 'Z'], description: 'Undo' },
  { keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo' },
  { keys: ['Ctrl', 'Enter'], description: 'Generate content' },
  { keys: ['Esc'], description: 'Close dialog' }
];

interface ShortcutsHelpProps {
  className?: string;
}

export function ShortcutsHelp({ className }: ShortcutsHelpProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        aria-label="Keyboard shortcuts"
      >
        <Keyboard className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Keyboard Shortcuts
            </h3>
            <div className="space-y-2">
              {EDITOR_SHORTCUTS.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center space-x-2">
                    {shortcut.keys.map((key, keyIndex) => (
                      <React.Fragment key={keyIndex}>
                        <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-md">
                          {key}
                        </kbd>
                        {keyIndex < shortcut.keys.length - 1 && (
                          <span className="text-gray-500">+</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <span className="text-gray-600">{shortcut.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}