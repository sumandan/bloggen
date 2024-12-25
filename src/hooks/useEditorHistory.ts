import { useRef, useCallback } from 'react';

interface HistoryState {
  content: string;
  selectionStart: number;
  selectionEnd: number;
}

export function useEditorHistory(onChange: (value: string) => void) {
  const historyRef = useRef<HistoryState[]>([]);
  const currentIndexRef = useRef<number>(-1);
  const isUndoRedoRef = useRef<boolean>(false);

  const pushToHistory = useCallback((content: string) => {
    if (isUndoRedoRef.current) {
      isUndoRedoRef.current = false;
      return;
    }

    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    
    const newState: HistoryState = {
      content,
      selectionStart: range?.startOffset || 0,
      selectionEnd: range?.endOffset || 0
    };

    // Remove any future states if we're in the middle of the history
    historyRef.current = historyRef.current.slice(0, currentIndexRef.current + 1);
    historyRef.current.push(newState);
    currentIndexRef.current++;

    // Limit history size
    if (historyRef.current.length > 100) {
      historyRef.current.shift();
      currentIndexRef.current--;
    }
  }, []);

  const undo = useCallback(() => {
    if (currentIndexRef.current > 0) {
      currentIndexRef.current--;
      isUndoRedoRef.current = true;
      const state = historyRef.current[currentIndexRef.current];
      onChange(state.content);
    }
  }, [onChange]);

  const redo = useCallback(() => {
    if (currentIndexRef.current < historyRef.current.length - 1) {
      currentIndexRef.current++;
      isUndoRedoRef.current = true;
      const state = historyRef.current[currentIndexRef.current];
      onChange(state.content);
    }
  }, [onChange]);

  return {
    pushToHistory,
    undo,
    redo
  };
}