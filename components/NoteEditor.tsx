import type { SaveStatus } from "@/hooks/useNotes";

interface NoteEditorProps {
  content: string;
  onChange: (content: string) => void;
  saveStatus: SaveStatus;
}

export function NoteEditor({ content, onChange, saveStatus }: NoteEditorProps) {
  return (
    <div className="flex flex-1 flex-col">
      <textarea
        className="flex-1 resize-none border-0 bg-[var(--color-bg)] p-3 text-sm leading-relaxed text-[var(--color-text)] outline-none placeholder:text-[var(--color-muted)]"
        placeholder="Start typing your note..."
        value={content}
        onChange={(e) => onChange(e.target.value)}
        autoFocus
      />
      <div className="flex items-center justify-end border-t border-[var(--color-border)] px-3 py-1.5">
        <span
          className={`text-xs transition-opacity duration-300 ${
            saveStatus === "idle"
              ? "opacity-0"
              : saveStatus === "saving"
                ? "text-[var(--color-muted)] opacity-100"
                : "text-[var(--color-success)] opacity-100"
          }`}
        >
          {saveStatus === "saving" ? "Saving…" : "Saved ✓"}
        </span>
      </div>
    </div>
  );
}
