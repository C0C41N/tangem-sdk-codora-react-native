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
