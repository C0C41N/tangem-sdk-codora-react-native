import { TangemSdkCodoraReactNative } from './nativeModule';
import type { Card, CreateAllWalletsResult, IScanResult, PurgeAllWalletsResult } from './types';

export async function scan(accessCode?: string, cardId?: string): Promise<Card> {
  const { card: cardJson, publicKeysBase58 } = (await TangemSdkCodoraReactNative.scan(accessCode, cardId)) as IScanResult;
  const card = JSON.parse(cardJson) as Card;
  card.wallets.forEach((w, i) => (w.publicKeyBase58 = publicKeysBase58[i]!));
  return card;
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
