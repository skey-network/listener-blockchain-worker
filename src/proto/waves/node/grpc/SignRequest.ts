// Original file: src/waves/transactions_api.proto

import type { Transaction as _waves_Transaction, Transaction__Output as _waves_Transaction__Output } from '../../../waves/Transaction';

export interface SignRequest {
  'transaction'?: (_waves_Transaction);
  'signer_public_key'?: (Buffer | Uint8Array | string);
}

export interface SignRequest__Output {
  'transaction'?: (_waves_Transaction__Output);
  'signer_public_key': (Buffer);
}
