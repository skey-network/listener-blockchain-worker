// Original file: src/waves/transaction.proto

import type { Amount as _waves_Amount, Amount__Output as _waves_Amount__Output } from '../waves/Amount';

export interface ReissueTransactionData {
  'asset_amount'?: (_waves_Amount);
  'reissuable'?: (boolean);
}

export interface ReissueTransactionData__Output {
  'asset_amount'?: (_waves_Amount__Output);
  'reissuable': (boolean);
}
