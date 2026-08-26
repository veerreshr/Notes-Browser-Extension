export default defineBackground(() => {
  // Open the side panel when the extension icon is clicked
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

  // Send the current tab URL to the side panel whenever the active tab changes
  async function sendTabUrl(tabId: number) {
    try {
      const tab = await chrome.tabs.get(tabId);
      if (tab?.url) {
        chrome.runtime.sendMessage({ type: "TAB_URL_CHANGED", url: tab.url });
      }
    } catch {
      // Tab may have been closed or is a restricted page
    }
  }

  chrome.tabs.onActivated.addListener(({ tabId }) => {
    sendTabUrl(tabId);
  });

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.active && tab.url) {
      chrome.runtime.sendMessage({ type: "TAB_URL_CHANGED", url: tab.url });
    }
  });
});
