// Original file: src/waves/accounts_api.proto

import type { _waves_DataTransactionData_DataEntry, _waves_DataTransactionData_DataEntry__Output } from '../../../waves/DataTransactionData';

export interface DataEntryResponse {
  'address'?: (Buffer | Uint8Array | string);
  'entry'?: (_waves_DataTransactionData_DataEntry);
}

export interface DataEntryResponse__Output {
  'address': (Buffer);
  'entry'?: (_waves_DataTransactionData_DataEntry__Output);
}
