import { Children } from "react";

type ShortcutProps = {
  keys: string[];
  className?: string;
};

export function Shortcut({ keys, className = "" }: ShortcutProps) {
  const keyOccurrences = new Map<string, number>();

  return (
    <span
      aria-hidden="true"
      className={`ml-2 hidden items-center gap-1 self-center lg:inline-flex ${className}`}
    >
      {Children.toArray(
        keys.map((key) => {
          const occurrence = keyOccurrences.get(key) ?? 0;
          keyOccurrences.set(key, occurrence + 1);
          const keyId = occurrence === 0 ? key : `${key}-${occurrence}`;

          return (
            <span
              key={keyId}
              className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 px-1.5 font-medium font-mono text-xs text-zinc-500 leading-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
            >
              {key}
            </span>
          );
        }),
      )}
    </span>
  );
}
