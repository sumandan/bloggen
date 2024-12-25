import { KeyboardEvent } from 'react';

type ExecCommand = (command: string, value?: string) => void;

export function useEditorShortcuts(execCommand: ExecCommand) {
  const handleKeyDown = (e: KeyboardEvent) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifier = isMac ? e.metaKey : e.ctrlKey;

    if (!modifier) return;

    // Text Formatting
    if (e.key === 'b') {
      e.preventDefault();
      execCommand('bold');
    } else if (e.key === 'i') {
      e.preventDefault();
      execCommand('italic');
    } else if (e.key === 'u') {
      e.preventDefault();
      execCommand('underline');
    } else if (e.key === 'k') {
      e.preventDefault();
      const url = prompt('Enter URL:');
      if (url) execCommand('createLink', url);
    } else if (e.key === 'x' && e.shiftKey) {
      e.preventDefault();
      execCommand('strikeThrough');
    }

    // Headings (with Alt/Option key)
    else if (e.altKey && e.key === '1') {
      e.preventDefault();
      execCommand('formatBlock', '<h1>');
    } else if (e.altKey && e.key === '2') {
      e.preventDefault();
      execCommand('formatBlock', '<h2>');
    } else if (e.altKey && e.key === '3') {
      e.preventDefault();
      execCommand('formatBlock', '<h3>');
    }

    // Lists
    else if (e.shiftKey && e.key === '7') {
      e.preventDefault();
      execCommand('insertOrderedList');
    } else if (e.shiftKey && e.key === '8') {
      e.preventDefault();
      execCommand('insertUnorderedList');
    }

    // Text Alignment
    else if (e.shiftKey && e.key === 'l') {
      e.preventDefault();
      execCommand('justifyLeft');
    } else if (e.shiftKey && e.key === 'e') {
      e.preventDefault();
      execCommand('justifyCenter');
    } else if (e.shiftKey && e.key === 'r') {
      e.preventDefault();
      execCommand('justifyRight');
    } else if (e.shiftKey && e.key === 'j') {
      e.preventDefault();
      execCommand('justifyFull');
    }

    // Editing Actions
    else if (e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      document.execCommand('undo', false);
      execCommand('undo');
    } else if (e.key === 'z' && e.shiftKey) {
      e.preventDefault();
      document.execCommand('redo', false);
      execCommand('redo');
    } else if (e.key === 'y' && !e.shiftKey) {
      e.preventDefault();
      document.execCommand('redo', false);
      execCommand('redo');
    }

    // Native browser shortcuts will handle:
    // - Ctrl/Cmd + A (Select all)
    // - Ctrl/Cmd + X (Cut)
    // - Ctrl/Cmd + C (Copy)
    // - Ctrl/Cmd + V (Paste)
  };

  return handleKeyDown;
}