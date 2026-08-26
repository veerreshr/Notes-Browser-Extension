import type { Note } from "@/types";

interface NotesListProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}

export function NotesList({
  notes,
  activeNoteId,
  onSelect,
  onDelete,
  onCreate,
}: NotesListProps) {
  function preview(content: string): string {
    const text = content.trim();
    if (!text) return "Empty note";
    return text.length > 80 ? text.slice(0, 80) + "…" : text;
  }

  function timeAgo(ts: number): string {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  return (
    <div className="flex h-full flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-3 py-2">
        <span className="text-xs font-medium text-[var(--color-text-secondary)]">
          {notes.length} note{notes.length !== 1 ? "s" : ""}
        </span>
        <button
          onClick={onCreate}
          className="rounded-md bg-[var(--color-primary)] px-2 py-0.5 text-xs font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)]"
          title="New note"
        >
          + New
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => onSelect(note.id)}
            className={`group cursor-pointer border-b border-[var(--color-border)] px-3 py-2 transition-colors ${
              note.id === activeNoteId
                ? "bg-[var(--color-primary)]/10 border-l-2 border-l-[var(--color-primary)]"
                : "hover:bg-[var(--color-bg)]"
            }`}
          >
            <p className="truncate text-xs text-[var(--color-text)]">
              {preview(note.content)}
            </p>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-[10px] text-[var(--color-muted)]">
                {timeAgo(note.updatedAt)}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note.id);
                }}
                className="text-[10px] text-[var(--color-danger)] opacity-0 transition-opacity group-hover:opacity-100"
                title="Delete note"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
