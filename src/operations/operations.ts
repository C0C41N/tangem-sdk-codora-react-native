import { Secp } from '@addressService/chain';
import { NativeModule } from '@nativeModule';
import { withNativeResponse } from '@withNativeResponse';
import type { INativeResponse } from '@types';
import type { Card } from './types/card';
import type {
  CreateAllWalletsResult,
  ICreateAllWalletsParams,
  IPurgeAllWalletsParams,
  IResetBackupParams,
  IResetCardParams,
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

  return withNativeResponse(async () => {
    const sig = (await NativeModule.sign(unsignedHex, pubKeyBase58, accessCode, cardId, msgHeader, msgBody)) as string;
    const isSecp = sig.length === 128;
    if (!isSecp) return sig;
    const secp = new Secp(pubKeyBase58);
    return secp.toSigHex65(sig, unsignedHex);
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

    const signedHexList = signatures.map((sig, i) => {
      const isSecp = sig.length === 128;
      if (!isSecp) return sig;
      const secp = new Secp(pubKeyBase58List[i]!);
      return secp.toSigHex65(sig, unsignedHexList[i]!);
    });

    return pubKeyBase58List.map((pubKeyBase58, i) => ({ pubKeyBase58, signedHex: signedHexList[i]! }));
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

export function resetCard(params: IResetCardParams): Promise<INativeResponse<void>> {
  const { accessCode, cardId, msgBody, msgHeader } = params;
  return withNativeResponse(() => NativeModule.resetCard(accessCode, cardId, msgHeader, msgBody));
}

export function enableBiometrics(enable: boolean): Promise<INativeResponse<void>> {
  return withNativeResponse(() => NativeModule.enableBiometrics(enable));
}
