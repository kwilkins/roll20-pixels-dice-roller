/**
 * @copyright 2024 Kevin Wilkinson
 * @license GPL-3.0-or-later
 * @summary Provides utility functions to interface with roll20.
 */

export const postChatMessage = (message: string) => {
  const chat = document.getElementById("textchat-input");
  const chatInput = chat?.getElementsByTagName("textarea")[0] ?? undefined;
  const chatSendButton = chat?.getElementsByTagName("button")[0] ?? undefined;

  if (chatInput && chatSendButton) {
    const unsentMessage = chatInput.value;
    chatInput.value = message;
    chatSendButton.click();
    chatInput.value = unsentMessage;
  } else {
    console.warn('Could not find roll20 chat on page.');
  }
};
