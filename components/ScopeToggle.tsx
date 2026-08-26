import type { Settings } from "@/types";

interface ScopeToggleProps {
  scopeMode: Settings["scopeMode"];
  onToggle: () => void;
}

export function ScopeToggle({ scopeMode, onToggle }: ScopeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1 rounded-full bg-[var(--color-bg-secondary)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text)]"
      title={`Showing notes for: ${scopeMode === "url" ? "this exact URL" : "this domain"}`}
    >
      <span
        className={
          scopeMode === "domain"
            ? "text-[var(--color-primary)]"
            : "text-[var(--color-text-secondary)]"
        }
      >
        Domain
      </span>
      <span className="text-[var(--color-muted)]">/</span>
      <span
        className={
          scopeMode === "url"
            ? "text-[var(--color-primary)]"
            : "text-[var(--color-text-secondary)]"
        }
      >
        URL
      </span>
    </button>
  );
}
