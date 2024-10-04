/**
 * @copyright 2024 Kevin Wilkinson
 * @license GPL-3.0-or-later
 * @summary Handles sending messages with the extension runtime.
 */

import { getCurrentActiveTabId } from "./getCurrentActiveTab";
import { Message } from "./types/message";
import { MessageAction } from "./types/messageAction";

export const sendMessageToExtension = async <E extends MessageAction>(message: Message<E>): Promise<void> => {
  return sendMessageInternal(message);
};

export const sendMessageToContentScript = async <E extends MessageAction>(message: Message<E>): Promise<void> => {
  return sendMessageInternal(message, 'currentTab');
};

export type MessageListenerCallback<E extends MessageAction> = (message: Message<E>) => void | Promise<void>;

export const addMessageListener = <E extends MessageAction>(callback: MessageListenerCallback<E>) => {
  chrome.runtime.onMessage.addListener((request, sender) => {
    const genericMessageAction = getEnumKeyByValue(MessageAction, request.action);

    if (genericMessageAction && request.action === genericMessageAction) {
      const message = request as Message<E>;
      callback(message);
    }
  });
};

const sendMessageInternal = async <E extends MessageAction>(message: Message<E>, tabId?: 'currentTab' | number): Promise<void> => {
  if (!tabId) {
    return chrome.runtime.sendMessage(message);
  }
  
  return chrome.tabs.sendMessage(
    tabId === 'currentTab'
      ? (await getCurrentActiveTabId())
      : tabId,
    message);
};

const getEnumKeyByValue = <T extends { [index: string]: string }>(enumObj: T, value: string): keyof T | null => {
  return (Object.keys(enumObj) as Array<keyof T>).find(key => enumObj[key] === value) || null;
}
