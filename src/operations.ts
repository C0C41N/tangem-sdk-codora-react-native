import { TangemSdkCodoraReactNative } from './nativeModule';
import type {
  Card,
  CreateAllWalletsResult,
  ICreateAllWalletsParams,
  IPurgeAllWalletsParams,
  IResetBackupParams,
  IScanParams,
  IScanResult,
  ISetAccessCodeParams,
  ISignParams,
  PurgeAllWalletsResult,
} from './types';

export async function scan(params: IScanParams): Promise<Card> {
  const { accessCode, cardId, msgBody, msgHeader } = params;

  const { card: cardJson, publicKeysBase58 } = (await TangemSdkCodoraReactNative.scan(
    accessCode,
    cardId,
    msgHeader,
    msgBody
  )) as IScanResult;

  const card = JSON.parse(cardJson) as Card;

  card.wallets.forEach((w, i) => (w.publicKeyBase58 = publicKeysBase58[i]!));

  return card;
}

export function sign(params: ISignParams): Promise<string> {
  const { unsignedHex, pubKeyBase58, accessCode, cardId, msgBody, msgHeader } = params;
  return TangemSdkCodoraReactNative.sign(unsignedHex, pubKeyBase58, accessCode, cardId, msgHeader, msgBody);
}

export function purgeAllWallets(params: IPurgeAllWalletsParams): Promise<PurgeAllWalletsResult> {
  const { accessCode, cardId, msgBody, msgHeader } = params;
  return TangemSdkCodoraReactNative.purgeAllWallets(accessCode, cardId, msgHeader, msgBody);
}

export function createAllWallets(params: ICreateAllWalletsParams): Promise<CreateAllWalletsResult> {
  const { accessCode, cardId, msgBody, msgHeader } = params;
  return TangemSdkCodoraReactNative.createAllWallets(accessCode, cardId, msgHeader, msgBody);
}

export function setAccessCode(params: ISetAccessCodeParams): Promise<void> {
  const { newAccessCode, accessCode, cardId, msgBody, msgHeader } = params;
  return TangemSdkCodoraReactNative.setAccessCode(newAccessCode, accessCode, cardId, msgHeader, msgBody);
}

export function resetBackup(params: IResetBackupParams): Promise<void> {
  const { accessCode, cardId, msgBody, msgHeader } = params;
  return TangemSdkCodoraReactNative.resetBackup(accessCode, cardId, msgHeader, msgBody);
}
