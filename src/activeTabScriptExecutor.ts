/**
 * @copyright 2024 Kevin Wilkinson
 * @license GPL-3.0-or-later
 * @summary Executes file script to select and connect to a Pixel die.
 * @description Because the bluetooth api is not available to an extension popup window, we're executing the bluetooth
 * connection code in the tab context.
 */

import { getCurrentActiveTabId } from "./getCurrentActiveTab";

export const executeContentScript = async (): Promise<void> => {
  const tabId = await getCurrentActiveTabId();

  return executeContentScriptFile(tabId);
};

const executeContentScriptFile = async (tabId: number): Promise<void> => {
  await chrome.scripting.executeScript({
    files: ['selectPixel.js'],
    target: {
      tabId: tabId
    }
  });
};
