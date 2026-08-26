export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

export function isValidNoteUrl(url: string): boolean {
  if (!url) return false;
  const blocked = ["chrome://", "chrome-extension://", "about:", "edge://", "brave://"];
  return !blocked.some((prefix) => url.startsWith(prefix));
}
