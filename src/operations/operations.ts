import { NativeModule } from '@nativeModule';
import { withNativeResponse } from '@withNativeResponse';
import type { INativeResponse } from '@types';
import type { Card } from './types/card';
import type {
  CreateAllWalletsResult,
  ICreateAllWalletsParams,
  IGetSolanaNonceAccount,
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

export async function scan(params: IScanParams): Promise<INativeResponse<Card>> {
  const { accessCode, cardId, msgBody, msgHeader } = params;

  return withNativeResponse(async () => {
    const { card: cardJson, publicKeysBase58 } = (await NativeModule.scan(
      accessCode,
      cardId,
      msgHeader,
      msgBody
    )) as IScanResult;

    const card = JSON.parse(cardJson) as Card;

    card.wallets.forEach((w, i) => (w.publicKeyBase58 = publicKeysBase58[i]!));

    return card;
  });
}

export function sign(params: ISignParams): Promise<INativeResponse<string>> {
  const { unsignedHex, pubKeyBase58, accessCode, cardId, msgBody, msgHeader } = params;

  return withNativeResponse(() => {
    return NativeModule.sign(unsignedHex, pubKeyBase58, accessCode, cardId, msgHeader, msgBody);
  });
}

export async function signMultiple(params: ISignMulParams): Promise<INativeResponse<ISignMulResult>> {
  const { signPayloads, accessCode, cardId, msgBody, msgHeader } = params;

  return withNativeResponse(async () => {
    const pubKeyBase58List = signPayloads.map((e) => e.pubKeyBase58);
    const unsignedHexList = signPayloads.map((e) => e.unsignedHex);

    if (unsignedHexList.length !== pubKeyBase58List.length)
      throw new Error('signMultiple: unsignedHexList.length !== pubKeyBase58List.length');

    const signatures = (await NativeModule.signMultiple(
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
  });
}

export function purgeAllWallets(params: IPurgeAllWalletsParams): Promise<INativeResponse<PurgeAllWalletsResult>> {
  const { accessCode, cardId, msgBody, msgHeader } = params;
  return withNativeResponse(() => NativeModule.purgeAllWallets(accessCode, cardId, msgHeader, msgBody));
}

export function createAllWallets(params: ICreateAllWalletsParams): Promise<INativeResponse<CreateAllWalletsResult>> {
  const { accessCode, cardId, msgBody, msgHeader } = params;
  return withNativeResponse(() => NativeModule.createAllWallets(accessCode, cardId, msgHeader, msgBody));
}

export function setAccessCode(params: ISetAccessCodeParams): Promise<INativeResponse<void>> {
  const { newAccessCode, accessCode, cardId, msgBody, msgHeader } = params;
  return withNativeResponse(() => NativeModule.setAccessCode(newAccessCode, accessCode, cardId, msgHeader, msgBody));
}

export function resetBackup(params: IResetBackupParams): Promise<INativeResponse<void>> {
  const { accessCode, cardId, msgBody, msgHeader } = params;
  return withNativeResponse(() => NativeModule.resetBackup(accessCode, cardId, msgHeader, msgBody));
}

export function resetCodes(params: IResetCodesParams): Promise<INativeResponse<void>> {
  const { accessCode, cardId, msgBody, msgHeader } = params;
  return withNativeResponse(() => NativeModule.resetCodes(accessCode, cardId, msgHeader, msgBody));
}

export function enableBiometrics(enable: boolean): Promise<INativeResponse<void>> {
  return withNativeResponse(() => NativeModule.enableBiometrics(enable));
}

export function getSolanaNonceAccount(params: IGetSolanaNonceAccount): Promise<INativeResponse<string>> {
  const { accessCode, cardId, msgBody, msgHeader } = params;
  return withNativeResponse(() => NativeModule.getSolanaNonceAccount(accessCode, cardId, msgHeader, msgBody));
}

export function deriveHDKey(): Promise<void> {
  const pubKeyBase58 = 'C9dZ4ekUeUUb1DRkSYBetZsuF4LCrhYYVTaQ7FEkR1HW';
  const path = `m/44'/501'/141414'/0'`;
  const accessCode = '141414';
  const cardId = undefined;
  const msgHeader = undefined;
  const msgBody = undefined;

  return NativeModule.deriveHDKey(pubKeyBase58, path, accessCode, cardId, msgHeader, msgBody);
}
