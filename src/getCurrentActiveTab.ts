/**
 * @copyright 2024 Kevin Wilkinson
 * @license GPL-3.0-or-later
 * @summary Gets the current active tab.
 */

export const getCurrentActiveTab = async (): Promise<chrome.tabs.Tab> => {
  const [currentTab,] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  return currentTab;
};

export const getCurrentActiveTabId = async (): Promise<number> => {
  const tab = await getCurrentActiveTab();

  if (!tab.id) {
    throw new Error('no tab id found');
  }

  return tab.id
};