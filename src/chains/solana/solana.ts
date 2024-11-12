import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';

import { SolanaEndpoint } from '.';
import { Chain } from '..';

import type { CreateTrxParams, CreateTrxRet, SendTrxParams } from '..';

export class Solana extends Chain<Transaction> {
  private connection: Connection;
  private fromPubkey: PublicKey;

  constructor(
    pubKeyBase58: string,
    private endpoint: SolanaEndpoint | string = SolanaEndpoint.dev
  ) {
    super(pubKeyBase58);
    this.connection = new Connection(this.endpoint, 'confirmed');
    this.fromPubkey = new PublicKey(this.pubKeyBase58);
  }

  public getPublicAddress(): string {
    return this.pubKeyBase58;
  }

  public async createTransaction(params: CreateTrxParams) {
    const { amount: amountInSol, receiverAddress } = params;

    const toPubkey = new PublicKey(receiverAddress);
    const lamports = LAMPORTS_PER_SOL * amountInSol;

    const transaction = new Transaction().add(SystemProgram.transfer({ fromPubkey: this.fromPubkey, lamports, toPubkey }));

    const { blockhash } = await this.connection.getLatestBlockhash();

    transaction.recentBlockhash = blockhash;
    transaction.feePayer = this.fromPubkey;

    const serializedTransaction = transaction.serializeMessage();
    const unsignedHex = serializedTransaction.toString('hex');

    return { transaction, unsignedHex } as CreateTrxRet<Transaction>;
  }

  public async sendTransaction(params: SendTrxParams<Transaction>) {
    const { transaction, signedHex } = params;

    const signature = Buffer.from(signedHex, 'hex');
    transaction.addSignature(this.fromPubkey, signature);
    const rawTransaction = transaction.serialize();
    const txId = await this.connection.sendRawTransaction(rawTransaction);

    return txId;
  }
}
