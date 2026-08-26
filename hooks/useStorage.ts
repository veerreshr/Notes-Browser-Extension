import { useCallback, useEffect, useState } from "react";
import {
  getStorageUsage,
  getAllDomains,
  deleteNotesByDomain,
  type DomainSummary,
} from "@/utils/storage";

export function useStorage() {
  const [usedBytes, setUsedBytes] = useState(0);
  const [quotaBytes, setQuotaBytes] = useState(10485760);
  const [domains, setDomains] = useState<DomainSummary[]>([]);

  const refresh = useCallback(async () => {
    const usage = await getStorageUsage();
    setUsedBytes(usage.usedBytes);
    setQuotaBytes(usage.quotaBytes);
    const domainList = await getAllDomains();
    setDomains(domainList);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const deleteDomain = useCallback(
    async (domain: string) => {
      await deleteNotesByDomain(domain);
      await refresh();
    },
    [refresh],
  );

  const usagePercent = quotaBytes > 0 ? (usedBytes / quotaBytes) * 100 : 0;

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }

  return {
    usedBytes,
    quotaBytes,
    usagePercent,
    domains,
    deleteDomain,
    refresh,
    formatBytes,
  };
}
