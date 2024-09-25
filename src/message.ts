/**
 * @copyright 2024 Kevin Wilkinson
 * @license GPL-3.0-or-later
 * @summary The message contracts.
 */

import { Pixel, PixelStatus } from "@systemic-games/pixels-core-connect";
import { MessageAction } from "./messageAction";

export interface RollBonusRequest {
  action: MessageAction.RollBonusRequest
}

export interface RollBonusResponse {
  action: MessageAction.RollBonusResponse
  value: number;
}

export interface PixelConnectionStatusRequest {
  action: MessageAction.PixelConnectionStatusRequest
};

export interface PixelConnectionStatusResponse {
  action: MessageAction.PixelConnectionStatusResponse
  status: PixelStatus;
};

export interface PixelReferenceMessageRequest {
  action: MessageAction.PixelReferenceRequest
};

export interface PixelReferenceMessageResponse {
  action: MessageAction.PixelReferenceResponse,
  pixel: Pixel
};

export type RequestMessage = RollBonusRequest | PixelConnectionStatusRequest | PixelReferenceMessageRequest;

export type ResponseMessage = RollBonusResponse | PixelConnectionStatusResponse | PixelReferenceMessageResponse;

export type Message<T extends MessageAction> = { action: T; } & (RequestMessage | ResponseMessage);
