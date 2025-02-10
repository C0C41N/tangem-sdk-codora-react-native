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

  public toSigHex65(sigHex64: string, digestHex: string) {
    const sig64 = Buffer.from(sigHex64, 'hex');
    const digest = Buffer.from(digestHex, 'hex');
    const pubKey = bs58.decode(this.pubKeyBase58);

    console.log('all good - 1');

    const r = sig64.subarray(0, 32);
    const s = sig64.subarray(32, 64);

    console.log('all good - 2');

    for (let v = 0; v < 2; v++) {
      console.log('all good - 3', v);
      const recKey = this.secp256k1.recoverPubKey(digest, { r, s }, v);
      console.log('all good - 4', v);
      const recPubKey = Buffer.from(recKey.encode('array', true));
      console.log('all good - 5', v);

      if (Buffer.from(recPubKey).equals(pubKey)) {
        console.log('all good - 6', v);
        return Buffer.concat([sig64, Buffer.from([27 + v])]).toString('hex');
      }
    }

    throw new Error('Unable to recover public key');
  }
}

export class Secp extends Chain {
  public getPublicAddress(): string {
    throw new Error('Method not implemented.');
  }
}
