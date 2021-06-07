// Original file: src/waves/transaction.proto

import type { Transaction as _waves_Transaction, Transaction__Output as _waves_Transaction__Output } from '../waves/Transaction';

export interface SignedTransaction {
  'transaction'?: (_waves_Transaction);
  'proofs'?: (Buffer | Uint8Array | string)[];
}

export interface SignedTransaction__Output {
  'transaction'?: (_waves_Transaction__Output);
  'proofs': (Buffer)[];
}
