import { TangemSdkCodoraReactNative } from './nativeModule';
import type { Card, CreateAllWalletsResult, PurgeAllWalletsResult } from './types';

export async function scan(accessCode?: string, cardId?: string): Promise<Card> {
  const cardJson = await TangemSdkCodoraReactNative.scan(accessCode, cardId);
  return JSON.parse(cardJson) as Card;
}

export function sign(unsignedHex: string, pubKeyBase58: string, accessCode?: string, cardId?: string): Promise<string> {
  return TangemSdkCodoraReactNative.sign(unsignedHex, pubKeyBase58, accessCode, cardId);
}

export async function createAllWallets(accessCode?: string, cardId?: string): Promise<CreateAllWalletsResult> {
  const result = await TangemSdkCodoraReactNative.createAllWallets(accessCode, cardId);
  return JSON.parse(result) as CreateAllWalletsResult;
}

export async function purgeAllWallets(accessCode?: string, cardId?: string): Promise<PurgeAllWalletsResult> {
  const result = await TangemSdkCodoraReactNative.purgeAllWallets(accessCode, cardId);
  return JSON.parse(result) as PurgeAllWalletsResult;
}
