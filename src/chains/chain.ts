import bs58 from 'bs58';
import { ec as EC } from 'elliptic';

import type { CreateTrxParams, CreateTrxRet, SendTrxParams } from './types';

export abstract class Chain<Trx> {
  protected secp256k1 = new EC('secp256k1');

  constructor(protected pubKeyBase58: string) {}

  public abstract getPublicAddress(): string;
  public abstract createTransaction(params: CreateTrxParams): Promise<CreateTrxRet<Trx>>;
  public abstract sendTransaction(params: SendTrxParams<Trx>): Promise<string>;

  public decompressPublicKey() {
    const compressedPubKeyBuffer = Buffer.from(bs58.decode(this.pubKeyBase58));

    const key = this.secp256k1.keyFromPublic(compressedPubKeyBuffer, 'array');
    const decompressedPubKeyArray = key.getPublic(false, 'array');
    const decompressedPubKeyBuffer = Buffer.from(decompressedPubKeyArray);

    return decompressedPubKeyBuffer;
  }

  public extractRS(signatureHex64: string) {
    const r = signatureHex64.slice(0, 64);
    const s = signatureHex64.slice(64);

    const hex = { r, s };
    const buffer = { r: Buffer.from(r, 'hex'), s: Buffer.from(s, 'hex') };

    return { buffer, hex };
  }

  public signatureHex64To65(signatureHex64: string, trxId: string) {
    const { r, s } = this.extractRS(signatureHex64).buffer;
    const publicKeyHex = this.decompressPublicKey().toString('hex');
    const trxIdBuffer = Buffer.from(trxId, 'hex');

    for (const v of [27, 28]) {
      try {
        const recoveredKey = this.secp256k1.recoverPubKey(trxIdBuffer, { r, s }, v - 27);
        const recoveredPublicKey = recoveredKey.encode('hex', false);
        if (recoveredPublicKey === publicKeyHex) return Buffer.concat([r, s, Buffer.from([v])]).toString('hex');
      } catch (err) {
        // ignore
      }
    }

    throw new Error('Failed to recover public key');
  }
}
