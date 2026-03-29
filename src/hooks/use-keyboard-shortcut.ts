import { useEffect } from "react";

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options?: { ctrl?: boolean; meta?: boolean; disabled?: boolean }
) {
  useEffect(() => {
    if (options?.disabled) return;

    const handler = (e: KeyboardEvent) => {
      const needsModifier = options?.ctrl || options?.meta;
      const hasModifier = e.ctrlKey || e.metaKey;

      if (needsModifier && !hasModifier) return;
      if (e.key.toLowerCase() !== key.toLowerCase()) return;

      e.preventDefault();
      callback();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [key, callback, options?.ctrl, options?.meta, options?.disabled]);
}
