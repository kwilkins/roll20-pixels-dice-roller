/**
 * @copyright 2024 Kevin Wilkinson
 * @license GPL-3.0-or-later
 * @summary The message contracts.
 */

import { PixelStatus } from "@systemic-games/pixels-core-connect";
import { MessageAction } from "./messageAction";
import { Dnd5eCharacterSheetBonuses } from "./dnd5e";

export interface CharacterSheetRequestMessage {
  action: MessageAction.CharacterSheetRequest
}

export interface CharacterSheetResponseMessage {
  action: MessageAction.CharacterSheetResponse;
  characterName: string;
  bonuses: Dnd5eCharacterSheetBonuses;
}

export interface PixelStatusRequestMessage {
  action: MessageAction.PixelStatusRequest;
};

export interface PixelStatusResponseMessage {
  action: MessageAction.PixelStatusResponse;
  status: PixelStatus;
};

export interface PixelConnectionRequestMessage {
  action: MessageAction.PixelConnectionRequest;
};

export interface PixelConnectionResponseMessage {
  action: MessageAction.PixelConnectionResponse;
  status: PixelStatus;
};

export interface RollBonusRequestMessage {
  action: MessageAction.RollBonusRequest;
}

export interface RollBonusResponseMessage {
  action: MessageAction.RollBonusResponse;
  value: number;
}

export type RequestMessage = CharacterSheetRequestMessage | RollBonusRequestMessage | PixelStatusRequestMessage | PixelConnectionRequestMessage;

export type ResponseMessage = CharacterSheetResponseMessage | RollBonusResponseMessage | PixelStatusResponseMessage | PixelConnectionResponseMessage;

export type Message<T extends MessageAction> = { action: T; } & (RequestMessage | ResponseMessage);
