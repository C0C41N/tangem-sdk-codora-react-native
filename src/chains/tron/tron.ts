import bs58 from 'bs58';
import keccak from 'keccak';

import { Buffer } from 'buffer';
import { createHash } from 'crypto';
import { TronWeb } from 'tronweb';

import { TronEndpoint, type SendTrx } from '.';
import { Chain } from '..';

import type { CreateTrxParams, CreateTrxRet, SendTrxParams } from '..';

export class Tron extends Chain<SendTrx> {
  private publicAddress: string;
  private connection: TronWeb;

  constructor(
    pubKeyBase58: string,
    private endpoint: TronEndpoint | string = TronEndpoint.nile
  ) {
    super(pubKeyBase58);
    this.publicAddress = this.calculatePublicAddress();
    this.connection = new TronWeb({ fullHost: this.endpoint, privateKey: '' });
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

  public async createTransaction(params: CreateTrxParams) {
    const { amount, receiverAddress } = params;

    const amountInSun = +this.connection.toSun(amount);

    const transaction = await this.connection.transactionBuilder.sendTrx(receiverAddress, amountInSun, this.publicAddress);
    const extendedTransaction = await this.connection.transactionBuilder.extendExpiration(transaction, 600);

    return {
      transaction: extendedTransaction,
      unsignedHex: extendedTransaction.txID,
    } as CreateTrxRet<SendTrx>;
  }

  public async sendTransaction(params: SendTrxParams<SendTrx>) {
    const { signedHex, transaction } = params;
    const signedHex65 = this.signatureHex64To65(signedHex, transaction.txID);
    transaction.signature = [signedHex65];
    const broadcast = await this.connection.trx.sendRawTransaction(transaction);
    return broadcast.transaction.txID;
  }
}
