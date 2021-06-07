// Original file: src/waves/events.proto

import type { Amount as _waves_Amount, Amount__Output as _waves_Amount__Output } from '../../waves/Amount';
import type { InvokeScriptResult as _waves_InvokeScriptResult, InvokeScriptResult__Output as _waves_InvokeScriptResult__Output } from '../../waves/InvokeScriptResult';
import type { Long } from '@grpc/proto-loader';

export interface _waves_events_TransactionMetadata_InvokeScriptMetadata_Argument {
  'integerValue'?: (number | string | Long);
  'binaryValue'?: (Buffer | Uint8Array | string);
  'stringValue'?: (string);
  'booleanValue'?: (boolean);
  'list'?: (_waves_events_TransactionMetadata_InvokeScriptMetadata_Argument_List);
  'value'?: "integerValue"|"binaryValue"|"stringValue"|"booleanValue"|"list";
}

export interface _waves_events_TransactionMetadata_InvokeScriptMetadata_Argument__Output {
  'integerValue'?: (string);
  'binaryValue'?: (Buffer);
  'stringValue'?: (string);
  'booleanValue'?: (boolean);
  'list'?: (_waves_events_TransactionMetadata_InvokeScriptMetadata_Argument_List__Output);
  'value': "integerValue"|"binaryValue"|"stringValue"|"booleanValue"|"list";
}

export interface _waves_events_TransactionMetadata_InvokeScriptMetadata {
  'dAppAddress'?: (Buffer | Uint8Array | string);
  'functionName'?: (string);
  'arguments'?: (_waves_events_TransactionMetadata_InvokeScriptMetadata_Argument)[];
  'payments'?: (_waves_Amount)[];
  'result'?: (_waves_InvokeScriptResult);
}

export interface _waves_events_TransactionMetadata_InvokeScriptMetadata__Output {
  'dAppAddress': (Buffer);
  'functionName': (string);
  'arguments': (_waves_events_TransactionMetadata_InvokeScriptMetadata_Argument__Output)[];
  'payments': (_waves_Amount__Output)[];
  'result'?: (_waves_InvokeScriptResult__Output);
}

export interface _waves_events_TransactionMetadata_LeaseMetadata {
  'recipientAddress'?: (Buffer | Uint8Array | string);
}

export interface _waves_events_TransactionMetadata_LeaseMetadata__Output {
  'recipientAddress': (Buffer);
}

export interface _waves_events_TransactionMetadata_InvokeScriptMetadata_Argument_List {
  'items'?: (_waves_events_TransactionMetadata_InvokeScriptMetadata_Argument)[];
}

export interface _waves_events_TransactionMetadata_InvokeScriptMetadata_Argument_List__Output {
  'items': (_waves_events_TransactionMetadata_InvokeScriptMetadata_Argument__Output)[];
}

export interface _waves_events_TransactionMetadata_MassTransferMetadata {
  'recipientsAddresses'?: (Buffer | Uint8Array | string)[];
}

export interface _waves_events_TransactionMetadata_MassTransferMetadata__Output {
  'recipientsAddresses': (Buffer)[];
}

export interface _waves_events_TransactionMetadata_TransferMetadata {
  'recipientAddress'?: (Buffer | Uint8Array | string);
}

export interface _waves_events_TransactionMetadata_TransferMetadata__Output {
  'recipientAddress': (Buffer);
}

export interface TransactionMetadata {
  'transfer'?: (_waves_events_TransactionMetadata_TransferMetadata);
  'massTransfer'?: (_waves_events_TransactionMetadata_MassTransferMetadata);
  'invokeScript'?: (_waves_events_TransactionMetadata_InvokeScriptMetadata);
  'leaseMeta'?: (_waves_events_TransactionMetadata_LeaseMetadata);
  'metadata'?: "transfer"|"massTransfer"|"invokeScript"|"leaseMeta";
}

export interface TransactionMetadata__Output {
  'transfer'?: (_waves_events_TransactionMetadata_TransferMetadata__Output);
  'massTransfer'?: (_waves_events_TransactionMetadata_MassTransferMetadata__Output);
  'invokeScript'?: (_waves_events_TransactionMetadata_InvokeScriptMetadata__Output);
  'leaseMeta'?: (_waves_events_TransactionMetadata_LeaseMetadata__Output);
  'metadata': "transfer"|"massTransfer"|"invokeScript"|"leaseMeta";
}
