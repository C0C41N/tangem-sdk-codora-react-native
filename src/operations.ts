import { TangemSdkCodoraReactNative } from './nativeModule';
import type {
  Card,
  CreateAllWalletsResult,
  ICreateAllWalletsParams,
  IPurgeAllWalletsParams,
  IResetBackupParams,
  IResetCodesParams,
  IScanParams,
  IScanResult,
  ISetAccessCodeParams,
  ISignMulParams,
  ISignMulResult,
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

export async function signMultiple(params: ISignMulParams): Promise<ISignMulResult> {
  const { signPayloads, accessCode, cardId, msgBody, msgHeader } = params;

  const pubKeyBase58List = signPayloads.map((e) => e.pubKeyBase58);
  const unsignedHexList = signPayloads.map((e) => e.unsignedHex);

  if (unsignedHexList.length !== pubKeyBase58List.length)
    throw new Error('signMultiple: unsignedHexList.length !== pubKeyBase58List.length');

  const signatures = (await TangemSdkCodoraReactNative.signMultiple(
    unsignedHexList,
    pubKeyBase58List,
    accessCode,
    cardId,
    msgHeader,
    msgBody
  )) as string[];

  if (signatures.length !== pubKeyBase58List.length)
    throw new Error('signMultiple: signatures.length !== pubKeyBase58List.length');

  return pubKeyBase58List.map((pubKeyBase58, i) => ({ pubKeyBase58, signedHex: signatures[i]! }));
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

export function resetCodes(params: IResetCodesParams): Promise<void> {
  const { accessCode, cardId, msgBody, msgHeader } = params;
  return TangemSdkCodoraReactNative.resetCodes(accessCode, cardId, msgHeader, msgBody);
}

export function enableBiometrics(enable: boolean): Promise<void> {
  return TangemSdkCodoraReactNative.enableBiometrics(enable);
}
