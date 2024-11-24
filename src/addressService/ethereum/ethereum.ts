import keccak from 'keccak';
import { Chain } from '@addressService/chain';

export class Ethereum extends Chain {
  private publicAddress: string;

  constructor(pubKeyBase58: string) {
    super(pubKeyBase58);
    this.publicAddress = this.calculatePublicAddress();
  }

  private calculatePublicAddress() {
    const decompressedPubKeyBuffer = this.decompressPublicKey();
    const decompressedPubKeyBufferDropFirst = decompressedPubKeyBuffer.subarray(1);

    const keccakHash = keccak('keccak256').update(decompressedPubKeyBufferDropFirst).digest();
    const addressPayload = keccakHash.subarray(-20);
    const finalAddress = '0x' + addressPayload.toString('hex');

    return finalAddress;
  }

  public getPublicAddress(): string {
    return this.publicAddress;
  }
}
