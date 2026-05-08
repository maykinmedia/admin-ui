import { useEffect } from "react";

export type KeyboardShortcutOptions = {
  key: string;
  /** When true, requires that Meta (Cmd) or Ctrl is held*/
  ctrlOrMeta?: boolean;
  shift?: boolean;
  alt?: boolean;
};

/**
 * Registers a global keyboard shortcut. The callback fires when the specified key combination is pressed
 */
export function useKeyboardShortcut(
  options: KeyboardShortcutOptions,
  callback: (() => void) | undefined,
): void {
  const { key, ctrlOrMeta, shift, alt } = options;

  useEffect(() => {
    if (!callback) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== key.toLowerCase()) return;
      if (ctrlOrMeta !== undefined && (e.metaKey || e.ctrlKey) !== ctrlOrMeta)
        return;
      if (shift !== undefined && e.shiftKey !== shift) return;
      if (alt !== undefined && e.altKey !== alt) return;

      e.preventDefault();
      callback();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [key, ctrlOrMeta, shift, alt, callback]);
}
