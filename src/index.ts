import { TangemSdkCodoraReactNative } from './nativeModule';
import type { Card, CreateAllWalletsResult, PurgeAllWalletsResult } from './types';

export async function scan(accessCode?: string, cardId?: string): Promise<Card> {
  const cardJson = await TangemSdkCodoraReactNative.scan(accessCode, cardId);
  return JSON.parse(cardJson) as Card;
}

export function sign(unsignedHex: string, pubKeyBase58: string, accessCode?: string, cardId?: string): Promise<string> {
  return TangemSdkCodoraReactNative.sign(unsignedHex, pubKeyBase58, accessCode, cardId);
}

export function purgeAllWallets(accessCode?: string, cardId?: string): Promise<PurgeAllWalletsResult> {
  return TangemSdkCodoraReactNative.purgeAllWallets(accessCode, cardId);
}

export function createAllWallets(accessCode?: string, cardId?: string): Promise<CreateAllWalletsResult> {
  return TangemSdkCodoraReactNative.createAllWallets(accessCode, cardId);
}
