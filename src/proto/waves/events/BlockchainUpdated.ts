// Original file: src/waves/events.proto

import type { StateUpdate as _waves_events_StateUpdate, StateUpdate__Output as _waves_events_StateUpdate__Output } from '../../waves/events/StateUpdate';
import type { Block as _waves_Block, Block__Output as _waves_Block__Output } from '../../waves/Block';
import type { SignedMicroBlock as _waves_SignedMicroBlock, SignedMicroBlock__Output as _waves_SignedMicroBlock__Output } from '../../waves/SignedMicroBlock';
import type { Long } from '@grpc/proto-loader';

export interface _waves_events_BlockchainUpdated_Append {
  'block'?: (_waves_events_BlockchainUpdated_Append_BlockAppend);
  'micro_block'?: (_waves_events_BlockchainUpdated_Append_MicroBlockAppend);
  'transaction_ids'?: (Buffer | Uint8Array | string)[];
  'state_update'?: (_waves_events_StateUpdate);
  'transaction_state_updates'?: (_waves_events_StateUpdate)[];
  'body'?: "block"|"micro_block";
}

export interface _waves_events_BlockchainUpdated_Append__Output {
  'block'?: (_waves_events_BlockchainUpdated_Append_BlockAppend__Output);
  'micro_block'?: (_waves_events_BlockchainUpdated_Append_MicroBlockAppend__Output);
  'transaction_ids': (Buffer)[];
  'state_update'?: (_waves_events_StateUpdate__Output);
  'transaction_state_updates': (_waves_events_StateUpdate__Output)[];
  'body': "block"|"micro_block";
}

export interface _waves_events_BlockchainUpdated_Append_BlockAppend {
  'block'?: (_waves_Block);
  'updated_waves_amount'?: (number | string | Long);
}

export interface _waves_events_BlockchainUpdated_Append_BlockAppend__Output {
  'block'?: (_waves_Block__Output);
  'updated_waves_amount': (string);
}

export interface _waves_events_BlockchainUpdated_Append_MicroBlockAppend {
  'micro_block'?: (_waves_SignedMicroBlock);
  'updated_transactions_root'?: (Buffer | Uint8Array | string);
}

export interface _waves_events_BlockchainUpdated_Append_MicroBlockAppend__Output {
  'micro_block'?: (_waves_SignedMicroBlock__Output);
  'updated_transactions_root': (Buffer);
}

export interface _waves_events_BlockchainUpdated_Rollback {
  'type'?: (_waves_events_BlockchainUpdated_Rollback_RollbackType | keyof typeof _waves_events_BlockchainUpdated_Rollback_RollbackType);
}

export interface _waves_events_BlockchainUpdated_Rollback__Output {
  'type': (keyof typeof _waves_events_BlockchainUpdated_Rollback_RollbackType);
}

// Original file: src/waves/events.proto

export enum _waves_events_BlockchainUpdated_Rollback_RollbackType {
  BLOCK = 0,
  MICROBLOCK = 1,
}

export interface BlockchainUpdated {
  'id'?: (Buffer | Uint8Array | string);
  'height'?: (number);
  'append'?: (_waves_events_BlockchainUpdated_Append);
  'rollback'?: (_waves_events_BlockchainUpdated_Rollback);
  'update'?: "append"|"rollback";
}

export interface BlockchainUpdated__Output {
  'id': (Buffer);
  'height': (number);
  'append'?: (_waves_events_BlockchainUpdated_Append__Output);
  'rollback'?: (_waves_events_BlockchainUpdated_Rollback__Output);
  'update': "append"|"rollback";
}
