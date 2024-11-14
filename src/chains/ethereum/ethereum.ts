import keccak from 'keccak';

import { Chain } from '..';

import type { CreateTrxParams, SendTrxParams } from '..';

export class Ethereum extends Chain<null> {
  private publicAddress: string;
  // private connection: null;

  constructor(
    pubKeyBase58: string
    // private endpoint: TronEndpoint | string = TronEndpoint.nile
  ) {
    super(pubKeyBase58);
    this.publicAddress = this.calculatePublicAddress();
    // this.connection = null;
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

  public async createTransaction(_params: CreateTrxParams) {
    return {
      transaction: null,
      unsignedHex: '',
    };
  }

  public async sendTransaction(_params: SendTrxParams<null>) {
    return '';
  }
}
