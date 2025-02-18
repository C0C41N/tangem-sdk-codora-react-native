"use strict";

import { Secp } from '../addressService/chain.js';
import { NativeModule } from '../nativeModule.js';
import { withNativeResponse } from '../withNativeResponse.js';
export async function scan(params) {
  const {
    accessCode,
    cardId,
    msgBody,
    msgHeader,
    migratePublicKey
  } = params;
  return withNativeResponse(async () => {
    const {
      card: cardJson,
      publicKeysBase58
    } = await NativeModule.scan(accessCode, cardId, msgHeader, msgBody, migratePublicKey);
    const card = JSON.parse(cardJson);
    card.wallets.forEach((w, i) => w.publicKeyBase58 = publicKeysBase58[i]);
    return card;
  });
}
export function sign(params) {
  const {
    unsignedHex,
    pubKeyBase58,
    accessCode,
    cardId,
    msgBody,
    msgHeader
  } = params;
  return withNativeResponse(async () => {
    const sig = await NativeModule.sign(unsignedHex, pubKeyBase58, accessCode, cardId, msgHeader, msgBody);
    const secp = new Secp(pubKeyBase58);
    if (!secp.isSecp()) return sig;
    return secp.toSigHex65(sig, unsignedHex);
  });
}
export async function signMultiple(params) {
  const {
    signPayloads,
    accessCode,
    cardId,
    msgBody,
    msgHeader
  } = params;
  return withNativeResponse(async () => {
    const pubKeyBase58List = signPayloads.map(e => e.pubKeyBase58);
    const unsignedHexList = signPayloads.map(e => e.unsignedHex);
    if (unsignedHexList.length !== pubKeyBase58List.length) throw new Error('signMultiple: unsignedHexList.length !== pubKeyBase58List.length');
    const signatures = await NativeModule.signMultiple(unsignedHexList, pubKeyBase58List, accessCode, cardId, msgHeader, msgBody);
    if (signatures.length !== pubKeyBase58List.length) throw new Error('signMultiple: signatures.length !== pubKeyBase58List.length');
    const signedHexList = signatures.map((sig, i) => {
      const secp = new Secp(pubKeyBase58List[i]);
      if (!secp.isSecp()) return sig;
      return secp.toSigHex65(sig, unsignedHexList[i]);
    });
    return pubKeyBase58List.map((pubKeyBase58, i) => ({
      pubKeyBase58,
      signedHex: signedHexList[i]
    }));
  });
}
export function purgeAllWallets(params) {
  const {
    accessCode,
    cardId,
    msgBody,
    msgHeader
  } = params;
  const onlyEd25519 = params.onlyEd25519 ?? false;
  return withNativeResponse(() => NativeModule.purgeAllWallets(accessCode, cardId, msgHeader, msgBody, onlyEd25519));
}
export function createAllWallets(params) {
  const {
    accessCode,
    cardId,
    msgBody,
    msgHeader
  } = params;
  return withNativeResponse(() => NativeModule.createAllWallets(accessCode, cardId, msgHeader, msgBody));
}
export function setAccessCode(params) {
  const {
    newAccessCode,
    accessCode,
    cardId,
    msgBody,
    msgHeader
  } = params;
  return withNativeResponse(() => NativeModule.setAccessCode(newAccessCode, accessCode, cardId, msgHeader, msgBody));
}
export function resetBackup(params) {
  const {
    accessCode,
    cardId,
    msgBody,
    msgHeader
  } = params;
  return withNativeResponse(() => NativeModule.resetBackup(accessCode, cardId, msgHeader, msgBody));
}
export function resetCodes(params) {
  const {
    accessCode,
    cardId,
    msgBody,
    msgHeader
  } = params;
  return withNativeResponse(() => NativeModule.resetCodes(accessCode, cardId, msgHeader, msgBody));
}
export function resetCard(params) {
  const {
    accessCode,
    cardId,
    msgBody,
    msgHeader
  } = params;
  return withNativeResponse(() => NativeModule.resetCard(accessCode, cardId, msgHeader, msgBody));
}
export function enableBiometrics(enable) {
  return withNativeResponse(() => NativeModule.enableBiometrics(enable));
}
export function enableUserCodeRecovery(params) {
  const {
    enable,
    accessCode,
    cardId,
    msgBody,
    msgHeader
  } = params;
  return withNativeResponse(() => NativeModule.enableUserCodeRecovery(enable, accessCode, cardId, msgHeader, msgBody));
}
//# sourceMappingURL=operations.js.map