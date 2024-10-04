/**
 * @copyright 2024 Kevin Wilkinson
 * @license GPL-3.0-or-later
 * @summary Executes scripts in the tab context.
 */

import { getCurrentActiveTabId } from "./getCurrentActiveTab";

export const executeContentScript = async (): Promise<void> => {
  const tabId = await getCurrentActiveTabId();

  return executeContentScriptFile(tabId);
};

const executeContentScriptFile = async (tabId: number): Promise<void> => {
  await chrome.scripting.executeScript({
    files: ['foobar.js'],
    target: {
      tabId: tabId,
      allFrames: true
    }
  });
};
