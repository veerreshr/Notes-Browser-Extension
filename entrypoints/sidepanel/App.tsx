import { useState } from "react";
import { useCurrentTab } from "@/hooks/useCurrentTab";
import { useNotes } from "@/hooks/useNotes";
import { useStorage } from "@/hooks/useStorage";
import { NoteEditor } from "@/components/NoteEditor";
import { NotesList } from "@/components/NotesList";
import { ScopeToggle } from "@/components/ScopeToggle";
import { StorageManager } from "@/components/StorageManager";

type View = "notes" | "storage";

export default function App() {
  const [view, setView] = useState<View>("notes");
  const tabInfo = useCurrentTab();
  const {
    notes,
    activeNote,
    activeNoteId,
    setActiveNoteId,
    createNote,
    updateNoteContent,
    removeNote,
    scopeMode,
    toggleScope,
    saveStatus,
  } = useNotes(tabInfo);
  const { usagePercent, formatBytes, usedBytes, refresh: refreshStorage } = useStorage();

  if (view === "storage") {
    return (
      <StorageManager
        onClose={() => {
          setView("notes");
          refreshStorage();
        }}
      />
    );
  }

  // Not a valid page for notes
  if (!tabInfo.isValid) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="text-3xl">📝</div>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Notes aren't available on this page.
        </p>
        <p className="text-xs text-[var(--color-muted)]">
          Navigate to a website to start taking notes.
        </p>
      </div>
    );
  }

  // Waiting for tab info
  if (!tabInfo.domain) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-xs text-[var(--color-muted)]">Loading…</div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-3 py-2">
        <img
          src={`https://www.google.com/s2/favicons?domain=${tabInfo.domain}&sz=16`}
          alt=""
          className="h-4 w-4"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-medium text-[var(--color-text)]">
            {tabInfo.domain}
          </div>
          {scopeMode === "url" && (
            <div className="truncate text-[10px] text-[var(--color-muted)]">
              {tabInfo.url}
            </div>
          )}
        </div>
        <ScopeToggle scopeMode={scopeMode} onToggle={toggleScope} />
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Notes sidebar */}
        <div className="w-36 flex-shrink-0">
          <NotesList
            notes={notes}
            activeNoteId={activeNoteId}
            onSelect={setActiveNoteId}
            onDelete={removeNote}
            onCreate={createNote}
          />
        </div>

        {/* Editor area */}
        <div className="flex flex-1 flex-col">
          {activeNote ? (
            <NoteEditor
              content={activeNote.content}
              onChange={updateNoteContent}
              saveStatus={saveStatus}
            />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
              <div className="text-2xl">✏️</div>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {notes.length === 0
                  ? "No notes yet for this site."
                  : "Select a note to edit."}
              </p>
              {notes.length === 0 && (
                <button
                  onClick={createNote}
                  className="rounded-md bg-[var(--color-primary)] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)]"
                >
                  Create your first note
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-[var(--color-border)] px-3 py-1.5">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--color-bg-secondary)]">
            <div
              className={`h-full rounded-full ${usagePercent > 80 ? "bg-amber-500" : "bg-[var(--color-primary)]"}`}
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-[var(--color-muted)]">
            {formatBytes(usedBytes)}
          </span>
        </div>
        <button
          onClick={() => setView("storage")}
          className="text-[10px] text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
        >
          Manage storage
        </button>
      </div>
    </div>
  );
}
