import { Secp } from '@addressService/chain';
import { NativeModule } from '@nativeModule';
import { withNativeResponse } from '@withNativeResponse';
import type { INativeResponse } from '@types';
import type { Card } from './types/card';
import type {
  CreateAllWalletsResult,
  ICreateAllWalletsParams,
  IEnableUserCodeRecoveryParams,
  IPurgeAllWalletsParams,
  IResetBackupParams,
  IResetCardParams,
  IResetCodesParams,
  IScanParams,
  IScanResponse,
  IScanRawResult,
  ISetAccessCodeParams,
  ISignMulParams,
  ISignMulResult,
  ISignParams,
  PurgeAllWalletsResult,
} from './types';
import { Platform } from 'react-native';

export async function scan(params: IScanParams): Promise<INativeResponse<IScanResponse>> {
  const { accessCode, cardId, msgBody, msgHeader, migratePublicKey } = params;

  const migrate = params.migrate ?? false;

  return withNativeResponse(async () => {
    const {
      card: cardJson,
      publicKeysBase58,
      migrateStatus,
    } = (await NativeModule.scan(accessCode, cardId, msgHeader, msgBody, migrate, migratePublicKey)) as IScanRawResult;

    const card = JSON.parse(cardJson) as Card;

    card.wallets.forEach((w, i) => (w.publicKeyBase58 = publicKeysBase58[i]!));

    return { card, migrateStatus };
  });
}

export function sign(params: ISignParams): Promise<INativeResponse<string>> {
  const { unsignedHex, pubKeyBase58, accessCode, cardId, msgBody, msgHeader } = params;

  return withNativeResponse(async () => {
    const sig = (await NativeModule.sign(unsignedHex, pubKeyBase58, accessCode, cardId, msgHeader, msgBody)) as string;
    if (!Secp.validate(pubKeyBase58)) return sig;
    return Secp.toSigHex65(pubKeyBase58, sig, unsignedHex);
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
      const pubKeyBase58 = pubKeyBase58List[i]!;
      const unsignedHex = unsignedHexList[i]!;
      if (!Secp.validate(pubKeyBase58)) return sig;
      return Secp.toSigHex65(pubKeyBase58, sig, unsignedHex);
    });

    return pubKeyBase58List.map((pubKeyBase58, i) => ({
      pubKeyBase58,
      unsignedHex: unsignedHexList[i]!,
      signedHex: signedHexList[i]!,
    }));
  });
}

export function purgeAllWallets(params: IPurgeAllWalletsParams): Promise<INativeResponse<PurgeAllWalletsResult>> {
  const { accessCode, cardId, msgBody, msgHeader } = params;
  const onlyEd25519 = params.onlyEd25519 ?? false;
  return withNativeResponse(() => NativeModule.purgeAllWallets(accessCode, cardId, msgHeader, msgBody, onlyEd25519));
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

export function enableUserCodeRecovery(params: IEnableUserCodeRecoveryParams): Promise<INativeResponse<void>> {
  const { enable, accessCode, cardId, msgBody, msgHeader } = params;
  return withNativeResponse(() => NativeModule.enableUserCodeRecovery(enable, accessCode, cardId, msgHeader, msgBody));
}

export function forceEnableReaderMode(): Promise<INativeResponse<boolean>> {
  if (Platform.OS !== 'android')
    return withNativeResponse(() => {
      console.log('forceEnableReaderMode() is only for android devices.');
      return Promise.resolve(false);
    });

  return withNativeResponse(() => NativeModule.forceEnableReaderMode());
}

export function forceDisableReaderMode(): Promise<INativeResponse<boolean>> {
  if (Platform.OS !== 'android')
    return withNativeResponse(() => {
      console.log('forceDisableReaderMode() is only for android devices.');
      return Promise.resolve(false);
    });

  return withNativeResponse(() => NativeModule.forceDisableReaderMode());
}
