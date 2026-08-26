import { useEffect, useState } from "react";
import { extractDomain, isValidNoteUrl } from "@/utils/url";

export interface TabInfo {
  url: string;
  domain: string;
  isValid: boolean;
}

export function useCurrentTab() {
  const [tabInfo, setTabInfo] = useState<TabInfo>({
    url: "",
    domain: "",
    isValid: false,
  });

  useEffect(() => {
    function updateTab(url: string) {
      const domain = extractDomain(url);
      setTabInfo({ url, domain, isValid: isValidNoteUrl(url) });
    }

    // Listen for URL changes from background
    function onMessage(message: { type: string; url?: string }) {
      if (message.type === "TAB_URL_CHANGED" && message.url) {
        updateTab(message.url);
      }
    }
    chrome.runtime.onMessage.addListener(onMessage);

    // Get the current tab URL on mount
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      if (tabs[0]?.url) {
        updateTab(tabs[0].url);
      }
    });

    return () => chrome.runtime.onMessage.removeListener(onMessage);
  }, []);

  return tabInfo;
}
