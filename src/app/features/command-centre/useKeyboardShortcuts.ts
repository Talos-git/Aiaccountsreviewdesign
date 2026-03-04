import { useEffect } from 'react';

interface KeyboardShortcutHandlers {
  onNext: () => void;
  onPrev: () => void;
  onMarkIrrelevant: () => void;
  onMarkComplete: () => void;
  onFocusNotes: () => void;
}

const isTypingTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || Boolean(target.closest('[role="textbox"]'));
};

export const useKeyboardShortcuts = ({
  onNext,
  onPrev,
  onMarkIrrelevant,
  onMarkComplete,
  onFocusNotes,
}: KeyboardShortcutHandlers): void => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (isTypingTarget(event.target)) {
        return;
      }

      const key = event.key.toLowerCase();

      if (key === 'j') {
        event.preventDefault();
        onNext();
        return;
      }

      if (key === 'k') {
        event.preventDefault();
        onPrev();
        return;
      }

      if (key === 'i') {
        event.preventDefault();
        onMarkIrrelevant();
        return;
      }

      if (key === 'c') {
        event.preventDefault();
        onMarkComplete();
        return;
      }

      if (key === 'n') {
        event.preventDefault();
        onFocusNotes();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onFocusNotes, onMarkComplete, onMarkIrrelevant, onNext, onPrev]);
};
