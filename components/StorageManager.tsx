import { useStorage } from "@/hooks/useStorage";

interface StorageManagerProps {
  onClose: () => void;
}

export function StorageManager({ onClose }: StorageManagerProps) {
  const {
    usedBytes,
    quotaBytes,
    usagePercent,
    domains,
    deleteDomain,
    formatBytes,
  } = useStorage();

  const isWarning = usagePercent > 80;

  return (
    <div className="flex h-full flex-col bg-[var(--color-bg)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-3 py-2">
        <h2 className="text-sm font-semibold text-[var(--color-text)]">
          Storage
        </h2>
        <button
          onClick={onClose}
          className="text-lg leading-none text-[var(--color-muted)] hover:text-[var(--color-text)]"
        >
          ×
        </button>
      </div>

      {/* Usage bar */}
      <div className="border-b border-[var(--color-border)] px-3 py-3">
        {isWarning && (
          <div className="mb-2 rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
            ⚠ Storage is almost full. Delete some notes to free space.
          </div>
        )}
        <div className="mb-1 flex justify-between text-xs text-[var(--color-text-secondary)]">
          <span>{formatBytes(usedBytes)} used</span>
          <span>{formatBytes(quotaBytes)} total</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[var(--color-bg-secondary)]">
          <div
            className={`h-full rounded-full transition-all ${
              isWarning ? "bg-amber-500" : "bg-[var(--color-primary)]"
            }`}
            style={{ width: `${Math.min(usagePercent, 100)}%` }}
          />
        </div>
        <div className="mt-1 text-right text-[10px] text-[var(--color-muted)]">
          {usagePercent.toFixed(1)}%
        </div>
      </div>

      {/* Domain list */}
      <div className="flex-1 overflow-y-auto">
        {domains.length === 0 ? (
          <div className="px-3 py-8 text-center text-xs text-[var(--color-muted)]">
            No notes stored yet.
          </div>
        ) : (
          domains.map((d) => (
            <div
              key={d.domain}
              className="flex items-center justify-between border-b border-[var(--color-border)] px-3 py-2"
            >
              <div>
                <div className="text-xs font-medium text-[var(--color-text)]">
                  {d.domain}
                </div>
                <div className="text-[10px] text-[var(--color-muted)]">
                  {d.noteCount} note{d.noteCount !== 1 ? "s" : ""} ·{" "}
                  {formatBytes(d.estimatedBytes)}
                </div>
              </div>
              <button
                onClick={() => deleteDomain(d.domain)}
                className="rounded px-2 py-0.5 text-[10px] text-[var(--color-danger)] transition-colors hover:bg-[var(--color-danger)]/10"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
