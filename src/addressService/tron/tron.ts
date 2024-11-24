import bs58 from 'bs58';
import keccak from 'keccak';
import { Buffer } from 'buffer';
import { createHash } from 'crypto';
import { Chain } from '@addressService/chain';

export class Tron extends Chain {
  private publicAddress: string;

  constructor(pubKeyBase58: string) {
    super(pubKeyBase58);
    this.publicAddress = this.calculatePublicAddress();
  }

  private calculatePublicAddress() {
    const decompressedPubKeyBuffer = this.decompressPublicKey();
    const decompressedPubKeyBufferDropFirst = decompressedPubKeyBuffer.subarray(1);

    const keccakHash = keccak('keccak256').update(decompressedPubKeyBufferDropFirst).digest();

    const addressPayload = Buffer.concat([Buffer.from([0x41]), keccakHash.subarray(-20)]); // 0x41 prefix

    const checksum = createHash('sha256').update(addressPayload).digest();
    const checksumFinal = createHash('sha256').update(checksum).digest().subarray(0, 4);

    const finalAddress = Buffer.concat([addressPayload, checksumFinal]);

    return bs58.encode(finalAddress);
  }

  public getPublicAddress(): string {
    return this.publicAddress;
  }
}
