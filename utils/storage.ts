import type { Note, Settings, StorageDomainKey } from "@/types";

function domainKey(domain: string): StorageDomainKey {
  return `notes:${domain}`;
}

export async function getNotesByDomain(domain: string): Promise<Note[]> {
  const key = domainKey(domain);
  const result = await chrome.storage.local.get(key);
  return (result[key] as Note[]) ?? [];
}

export async function saveNote(note: Note): Promise<void> {
  const key = domainKey(note.domain);
  const notes = await getNotesByDomain(note.domain);
  const idx = notes.findIndex((n) => n.id === note.id);
  if (idx >= 0) {
    notes[idx] = note;
  } else {
    notes.push(note);
  }
  await chrome.storage.local.set({ [key]: notes });
}

export async function deleteNote(id: string, domain: string): Promise<void> {
  const key = domainKey(domain);
  const notes = await getNotesByDomain(domain);
  const filtered = notes.filter((n) => n.id !== id);
  if (filtered.length === 0) {
    await chrome.storage.local.remove(key);
  } else {
    await chrome.storage.local.set({ [key]: filtered });
  }
}

export async function deleteNotesByDomain(domain: string): Promise<void> {
  await chrome.storage.local.remove(domainKey(domain));
}

export async function getStorageUsage(): Promise<{
  usedBytes: number;
  quotaBytes: number;
}> {
  const usedBytes = await chrome.storage.local.getBytesInUse(null);
  const quotaBytes = chrome.storage.local.QUOTA_BYTES ?? 10485760; // 10 MB default
  return { usedBytes, quotaBytes };
}

export interface DomainSummary {
  domain: string;
  noteCount: number;
  estimatedBytes: number;
}

export async function getAllDomains(): Promise<DomainSummary[]> {
  const all = await chrome.storage.local.get(null);
  const summaries: DomainSummary[] = [];
  for (const [key, value] of Object.entries(all)) {
    if (key.startsWith("notes:") && Array.isArray(value)) {
      const domain = key.slice(6); // Remove "notes:" prefix
      const notes = value as Note[];
      const estimatedBytes = new Blob([JSON.stringify(notes)]).size;
      summaries.push({ domain, noteCount: notes.length, estimatedBytes });
    }
  }
  return summaries.sort((a, b) => b.estimatedBytes - a.estimatedBytes);
}

export async function getSettings(): Promise<Settings> {
  const result = await chrome.storage.local.get("settings");
  return (result.settings as Settings) ?? { scopeMode: "domain" };
}

export async function saveSettings(settings: Settings): Promise<void> {
  await chrome.storage.local.set({ settings });
}
