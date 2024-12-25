import { useCallback, RefObject, useEffect } from 'react';
import { useEditorHistory } from './useEditorHistory';

export function useEditor(
  editorRef: RefObject<HTMLDivElement>,
  onChange: (value: string) => void
) {
  const { pushToHistory, undo, redo } = useEditorHistory(onChange);

  useEffect(() => {
    if (editorRef.current) {
      // Initialize history with current content
      pushToHistory(editorRef.current.innerHTML);
    }
  }, [pushToHistory]);

  const execCommand = useCallback((command: string, value?: string) => {
    let handled = false;

    if (command === 'undo') {
      undo();
      handled = true;
    } else if (command === 'redo') {
      redo();
      handled = true;
    }

    if (!handled) {
      document.execCommand(command, false, value);
      if (editorRef.current) {
        pushToHistory(editorRef.current.innerHTML);
      }
    }

    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [editorRef, onChange, pushToHistory, undo, redo]);

  const getCurrentFormat = useCallback((format: string): boolean => {
    return document.queryCommandState(format);
  }, []);

  const handleKeyCommand = useCallback((command: string): boolean => {
    if (command === 'bold') {
      execCommand('bold');
      return true;
    }
    if (command === 'italic') {
      execCommand('italic');
      return true;
    }
    if (command === 'underline') {
      execCommand('underline');
      return true;
    }
    return false;
  }, [execCommand]);

  return {
    execCommand,
    getCurrentFormat,
    handleKeyCommand
  };
}