// Original file: src/waves/transaction.proto

import type { Recipient as _waves_Recipient, Recipient__Output as _waves_Recipient__Output } from '../waves/Recipient';
import type { Long } from '@grpc/proto-loader';

export interface LeaseTransactionData {
  'recipient'?: (_waves_Recipient);
  'amount'?: (number | string | Long);
}

export interface LeaseTransactionData__Output {
  'recipient'?: (_waves_Recipient__Output);
  'amount': (string);
}
