/**
 * @copyright 2024 Kevin Wilkinson
 * @license GPL-3.0-or-later
 * @summary The file script to select, connect, and listen to a Pixel die.
 * @description Because the bluetooth api is not available to an extension popup window, we're containing all the
 * bluetooth connection logic in this file and executing it in the tab context.
 */

import { PixelStatus, repeatConnect } from "@systemic-games/pixels-core-connect";
import {
  Pixel,
requestPixel,
} from "@systemic-games/pixels-web-connect";
import { addMessageListener, sendMessageToExtension } from "../chromeMessaging";
import { MessageAction } from "../types/messageAction";
import { postChatMessage } from '../roll20Helpers';

interface SelectPixelState {
  pixel: Pixel | undefined;
  rollBonus: number;
}

if (!window.location.href.startsWith('chrome-extension:')) {

  const state: SelectPixelState = {
    pixel: undefined,
    rollBonus: 0
  };

  const connectToPixel = async () => {
    const requestedPixel = await requestPixel();
    console.log("Connecting to pixel...");
    await repeatConnect(requestedPixel);
    
    console.log(state);
    // add a listener for Pixel rolls
    requestedPixel.addEventListener('roll', (roll: number) => {
      console.log(state);
      const rollMessage = `Pixel rolled: ${roll + state.rollBonus} (🎲${roll} + ${state.rollBonus})`;
      postChatMessage(rollMessage)
      console.log(rollMessage);
    });
  
    // add a listener for Pixel status
    requestedPixel.addEventListener('status', (status: PixelStatus) => {
      sendMessageToExtension({
        action: MessageAction.PixelStatusResponse,
        status
      });
    });

    state.pixel = requestedPixel;
  };

  // add a listener for extension roll bonus
  addMessageListener<MessageAction.RollBonusResponse>(
    (message) => {
      console.log(message);
      state.rollBonus = message.value;
  });

  // add a listener for extension pixel connection status
  addMessageListener<MessageAction.PixelStatusRequest>(
    (_message) => {
      sendMessageToExtension({
        action: MessageAction.PixelStatusResponse,
        status: state.pixel?.status ?? 'disconnected'
      });
  });

  // add a listener for invoking pixel connection
  addMessageListener<MessageAction.PixelConnectionRequest>(
    async (_message) => {
      await connectToPixel();

      if (state.pixel?.status) {
        sendMessageToExtension({
          action: MessageAction.PixelConnectionResponse,
          status: state.pixel.status
        });
      } else {
        console.error('No Pixel reference', state.pixel);
      }
  });
}
