/**
 * @copyright 2024 Kevin Wilkinson
 * @license GPL-3.0-or-later
 * @summary The file script to select, connect, and listen to a Pixel die.
 * @description Because the bluetooth api is not available to an extension popup window, we're containing all the
 * bluetooth connection logic in this file and executing it in the tab context.
 */

import { PixelStatus, repeatConnect } from "@systemic-games/pixels-core-connect";
import {
requestPixel,
} from "@systemic-games/pixels-web-connect";
import { addMessageListener, sendMessageToExtension } from "./chromeMessaging";
import { MessageAction } from "./messageAction";

if ((window as any).roll20PixelsDiceRoller === undefined) {
  (window as any).roll20PixelsDiceRoller = true;

  const state = {
    rollBonus: 0
  }

  const pixel = await requestPixel();

  console.log("Connecting to pixel...");
  await repeatConnect(pixel);
  
  // add a listener for Pixel rolls
  pixel.addEventListener('roll', (roll: number) => {
    console.log(`Pixel rolled: ${roll+state.rollBonus} (🎲${roll} + ${state.rollBonus})`);
  });

  // add a listener for Pixel status
  pixel.addEventListener('status', (status: PixelStatus) => {
    sendMessageToExtension({
      action: MessageAction.PixelConnectionStatusResponse,
      status
    });

    if (status === 'disconnected') {
      (window as any).roll20PixelsDiceRoller = undefined;
    }
  });

  // add a listener for extension roll bonus
  addMessageListener<MessageAction.RollBonusResponse>(
    (message) => {
      console.log(message);
      state.rollBonus = message.value;
  });

  // add a listener for extension pixel connection status
  addMessageListener<MessageAction.PixelConnectionStatusRequest>(
    (_message) => {
      sendMessageToExtension({
        action: MessageAction.PixelConnectionStatusResponse,
        status: pixel.status
      });
  });
}
