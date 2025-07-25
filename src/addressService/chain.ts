import { Buffer } from 'node:buffer';
import bs58 from 'bs58';
import { ec as EC } from 'elliptic';

export abstract class Chain {
  protected secp256k1 = new EC('secp256k1');

  constructor(protected pubKeyBase58: string) {}

  public abstract getPublicAddress(): string;

  protected decompressPublicKey() {
    const compressedPubKeyBuffer = Buffer.from(bs58.decode(this.pubKeyBase58));

    const key = this.secp256k1.keyFromPublic(compressedPubKeyBuffer, 'array');
    const decompressedPubKeyArray = key.getPublic(false, 'array');
    const decompressedPubKeyBuffer = Buffer.from(decompressedPubKeyArray);

    return decompressedPubKeyBuffer;
  }
}

export class Secp {
  private static secp256k1 = new EC('secp256k1');

  public static validate(pubKeyBase58: string) {
    try {
      const pubKeyHex = Buffer.from(bs58.decode(pubKeyBase58)).toString('hex');
      const pubKey = this.secp256k1.keyFromPublic(pubKeyHex, 'hex');
      return pubKey.validate().result;
    } catch (error) {
      return false;
    }
  }

  public static toSigHex65(pubKeyBase58: string, sigHex64: string, digestHex: string) {
    const sig64 = Buffer.from(sigHex64, 'hex');
    const digest = Buffer.from(digestHex, 'hex');
    const pubKey = bs58.decode(pubKeyBase58);

    const r = sig64.subarray(0, 32);
    const s = sig64.subarray(32, 64);

    for (let v = 0; v < 2; v++) {
      const recKey = this.secp256k1.recoverPubKey(digest, { r, s }, v);
      const recPubKey = Buffer.from(recKey.encode('array', true));

      if (Buffer.from(recPubKey).equals(Buffer.from(pubKey))) {
        return Buffer.concat([sig64, Buffer.from([27 + v])]).toString('hex');
      }
    }

    throw new Error('Unable to recover public key');
  }
}
