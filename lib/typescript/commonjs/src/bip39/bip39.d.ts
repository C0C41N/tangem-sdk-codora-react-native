import type { INativeResponse } from '@types';
import type { BIP39WordCount } from './types';
export declare function generateMnemonic(wordCount: BIP39WordCount): Promise<INativeResponse<string[]>>;
export declare function validateMnemonic(mnemonic: string[]): Promise<INativeResponse<boolean>>;
//# sourceMappingURL=bip39.d.ts.map