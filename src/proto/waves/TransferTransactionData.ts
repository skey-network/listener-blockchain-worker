// Original file: src/waves/transaction.proto

import type { Recipient as _waves_Recipient, Recipient__Output as _waves_Recipient__Output } from '../waves/Recipient';
import type { Amount as _waves_Amount, Amount__Output as _waves_Amount__Output } from '../waves/Amount';

export interface TransferTransactionData {
  'recipient'?: (_waves_Recipient);
  'amount'?: (_waves_Amount);
  'attachment'?: (Buffer | Uint8Array | string);
}

export interface TransferTransactionData__Output {
  'recipient'?: (_waves_Recipient__Output);
  'amount'?: (_waves_Amount__Output);
  'attachment': (Buffer);
}
