import keccak from 'keccak';
import { ethers, Transaction } from 'ethers';
import { Chain } from '..';
import type { CreateTrxParams, SendTrxParams } from '..';

export class Ethereum extends Chain<Transaction> {
  private publicAddress: string;
  private connection: ethers.JsonRpcProvider;

  constructor(
    pubKeyBase58: string,
    private endpoint: string,
    private chainId: number
  ) {
    super(pubKeyBase58);
    this.publicAddress = this.calculatePublicAddress();
    this.connection = new ethers.JsonRpcProvider(this.endpoint);
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

  public async createTransaction(params: CreateTrxParams) {
    const { amount, receiverAddress, gasLimit, maxFeePerGas } = params;

    const tx = {
      to: receiverAddress,
      value: ethers.parseEther(amount.toString()),
      nonce: await this.connection.getTransactionCount(this.publicAddress),
      chainId: this.chainId,
    };

    const txResolved = await ethers.resolveProperties(tx);
    const transaction = Transaction.from(txResolved);

    transaction.gasLimit = gasLimit || ethers.hexlify('0x5208');
    transaction.maxFeePerGas = maxFeePerGas || ethers.parseUnits('10', 'gwei');

    const unsignedHex = transaction.unsignedHash;

    return {
      unsignedHex,
      transaction,
    };
  }

  public async sendTransaction(params: SendTrxParams<Transaction>) {
    const { signedHex, transaction } = params;
    transaction.signature = this.signatureHex64To65(signedHex, transaction.unsignedHash);
    return await this.connection.send('eth_sendRawTransaction', [transaction.serialized]);
  }
}
