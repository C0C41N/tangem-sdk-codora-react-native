import { TangemSdkCodoraReactNative } from './nativeModule';
import type { CreateAllWalletsResult, PurgeAllWalletsResult } from './types';

export function scan(accessCode?: string, cardId?: string): Promise<string> {
  return TangemSdkCodoraReactNative.scan(accessCode, cardId);
}

export function sign(unsignedHex: string, pubKeyBase58: string, accessCode?: string, cardId?: string): Promise<string> {
  return TangemSdkCodoraReactNative.sign(unsignedHex, pubKeyBase58, accessCode, cardId);
}

export function createAllWallets(accessCode?: string, cardId?: string): Promise<CreateAllWalletsResult> {
  return TangemSdkCodoraReactNative.createAllWallets(accessCode, cardId);
}

export function purgeAllWallets(accessCode?: string, cardId?: string): Promise<PurgeAllWalletsResult> {
  return TangemSdkCodoraReactNative.purgeAllWallets(accessCode, cardId);
}
