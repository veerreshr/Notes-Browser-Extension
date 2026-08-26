export interface Note {
  id: string;
  content: string;
  url: string;
  domain: string;
  createdAt: number;
  updatedAt: number;
}

export interface Settings {
  scopeMode: "url" | "domain";
}

export type StorageDomainKey = `notes:${string}`;
