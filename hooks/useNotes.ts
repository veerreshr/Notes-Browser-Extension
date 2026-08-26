import { useCallback, useEffect, useRef, useState } from "react";
import type { Note, Settings } from "@/types";
import {
  getNotesByDomain,
  saveNote,
  deleteNote as deleteNoteStorage,
  getSettings,
  saveSettings,
} from "@/utils/storage";
import type { TabInfo } from "./useCurrentTab";

export type SaveStatus = "idle" | "saving" | "saved";

export function useNotes(tabInfo: TabInfo) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [scopeMode, setScopeMode] = useState<Settings["scopeMode"]>("domain");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Load settings once
  useEffect(() => {
    getSettings().then((s) => setScopeMode(s.scopeMode));
  }, []);

  // Load notes whenever tab info or scope changes
  useEffect(() => {
    if (!tabInfo.domain || !tabInfo.isValid) {
      setNotes([]);
      setActiveNoteId(null);
      return;
    }

    getNotesByDomain(tabInfo.domain).then((allNotes) => {
      let filtered: Note[];
      if (scopeMode === "url") {
        filtered = allNotes.filter((n) => n.url === tabInfo.url);
      } else {
        filtered = allNotes;
      }
      // Sort newest first
      filtered.sort((a, b) => b.updatedAt - a.updatedAt);
      setNotes(filtered);
      // Auto-select first note, or none
      setActiveNoteId(filtered.length > 0 ? filtered[0].id : null);
    });
  }, [tabInfo.url, tabInfo.domain, tabInfo.isValid, scopeMode]);

  const activeNote = notes.find((n) => n.id === activeNoteId) ?? null;

  const createNote = useCallback(() => {
    if (!tabInfo.domain || !tabInfo.isValid) return;
    const note: Note = {
      id: crypto.randomUUID(),
      content: "",
      url: tabInfo.url,
      domain: tabInfo.domain,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes((prev) => [note, ...prev]);
    setActiveNoteId(note.id);
    saveNote(note);
  }, [tabInfo]);

  const updateNoteContent = useCallback(
    (content: string) => {
      if (!activeNoteId) return;

      // Update local state immediately
      setNotes((prev) =>
        prev.map((n) =>
          n.id === activeNoteId ? { ...n, content, updatedAt: Date.now() } : n,
        ),
      );

      // Debounced save to storage
      setSaveStatus("saving");
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const updated = {
          ...notes.find((n) => n.id === activeNoteId)!,
          content,
          updatedAt: Date.now(),
        };
        saveNote(updated).then(() => {
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 1500);
        });
      }, 500);
    },
    [activeNoteId, notes],
  );

  const removeNote = useCallback(
    async (id: string) => {
      if (!tabInfo.domain) return;
      await deleteNoteStorage(id, tabInfo.domain);
      setNotes((prev) => {
        const remaining = prev.filter((n) => n.id !== id);
        if (activeNoteId === id) {
          setActiveNoteId(remaining.length > 0 ? remaining[0].id : null);
        }
        return remaining;
      });
    },
    [tabInfo.domain, activeNoteId],
  );

  const toggleScope = useCallback(async () => {
    const newMode = scopeMode === "url" ? "domain" : "url";
    setScopeMode(newMode);
    await saveSettings({ scopeMode: newMode });
  }, [scopeMode]);

  return {
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
  };
}
