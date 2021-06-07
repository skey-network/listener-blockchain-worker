// Original file: src/waves/transaction.proto

import type { Amount as _waves_Amount, Amount__Output as _waves_Amount__Output } from '../waves/Amount';
import type { GenesisTransactionData as _waves_GenesisTransactionData, GenesisTransactionData__Output as _waves_GenesisTransactionData__Output } from '../waves/GenesisTransactionData';
import type { PaymentTransactionData as _waves_PaymentTransactionData, PaymentTransactionData__Output as _waves_PaymentTransactionData__Output } from '../waves/PaymentTransactionData';
import type { IssueTransactionData as _waves_IssueTransactionData, IssueTransactionData__Output as _waves_IssueTransactionData__Output } from '../waves/IssueTransactionData';
import type { TransferTransactionData as _waves_TransferTransactionData, TransferTransactionData__Output as _waves_TransferTransactionData__Output } from '../waves/TransferTransactionData';
import type { ReissueTransactionData as _waves_ReissueTransactionData, ReissueTransactionData__Output as _waves_ReissueTransactionData__Output } from '../waves/ReissueTransactionData';
import type { BurnTransactionData as _waves_BurnTransactionData, BurnTransactionData__Output as _waves_BurnTransactionData__Output } from '../waves/BurnTransactionData';
import type { ExchangeTransactionData as _waves_ExchangeTransactionData, ExchangeTransactionData__Output as _waves_ExchangeTransactionData__Output } from '../waves/ExchangeTransactionData';
import type { LeaseTransactionData as _waves_LeaseTransactionData, LeaseTransactionData__Output as _waves_LeaseTransactionData__Output } from '../waves/LeaseTransactionData';
import type { LeaseCancelTransactionData as _waves_LeaseCancelTransactionData, LeaseCancelTransactionData__Output as _waves_LeaseCancelTransactionData__Output } from '../waves/LeaseCancelTransactionData';
import type { CreateAliasTransactionData as _waves_CreateAliasTransactionData, CreateAliasTransactionData__Output as _waves_CreateAliasTransactionData__Output } from '../waves/CreateAliasTransactionData';
import type { MassTransferTransactionData as _waves_MassTransferTransactionData, MassTransferTransactionData__Output as _waves_MassTransferTransactionData__Output } from '../waves/MassTransferTransactionData';
import type { DataTransactionData as _waves_DataTransactionData, DataTransactionData__Output as _waves_DataTransactionData__Output } from '../waves/DataTransactionData';
import type { SetScriptTransactionData as _waves_SetScriptTransactionData, SetScriptTransactionData__Output as _waves_SetScriptTransactionData__Output } from '../waves/SetScriptTransactionData';
import type { SponsorFeeTransactionData as _waves_SponsorFeeTransactionData, SponsorFeeTransactionData__Output as _waves_SponsorFeeTransactionData__Output } from '../waves/SponsorFeeTransactionData';
import type { SetAssetScriptTransactionData as _waves_SetAssetScriptTransactionData, SetAssetScriptTransactionData__Output as _waves_SetAssetScriptTransactionData__Output } from '../waves/SetAssetScriptTransactionData';
import type { InvokeScriptTransactionData as _waves_InvokeScriptTransactionData, InvokeScriptTransactionData__Output as _waves_InvokeScriptTransactionData__Output } from '../waves/InvokeScriptTransactionData';
import type { UpdateAssetInfoTransactionData as _waves_UpdateAssetInfoTransactionData, UpdateAssetInfoTransactionData__Output as _waves_UpdateAssetInfoTransactionData__Output } from '../waves/UpdateAssetInfoTransactionData';
import type { Long } from '@grpc/proto-loader';

export interface Transaction {
  'chain_id'?: (number);
  'sender_public_key'?: (Buffer | Uint8Array | string);
  'fee'?: (_waves_Amount);
  'timestamp'?: (number | string | Long);
  'version'?: (number);
  'genesis'?: (_waves_GenesisTransactionData);
  'payment'?: (_waves_PaymentTransactionData);
  'issue'?: (_waves_IssueTransactionData);
  'transfer'?: (_waves_TransferTransactionData);
  'reissue'?: (_waves_ReissueTransactionData);
  'burn'?: (_waves_BurnTransactionData);
  'exchange'?: (_waves_ExchangeTransactionData);
  'lease'?: (_waves_LeaseTransactionData);
  'lease_cancel'?: (_waves_LeaseCancelTransactionData);
  'create_alias'?: (_waves_CreateAliasTransactionData);
  'mass_transfer'?: (_waves_MassTransferTransactionData);
  'data_transaction'?: (_waves_DataTransactionData);
  'set_script'?: (_waves_SetScriptTransactionData);
  'sponsor_fee'?: (_waves_SponsorFeeTransactionData);
  'set_asset_script'?: (_waves_SetAssetScriptTransactionData);
  'invoke_script'?: (_waves_InvokeScriptTransactionData);
  'update_asset_info'?: (_waves_UpdateAssetInfoTransactionData);
  'data'?: "genesis"|"payment"|"issue"|"transfer"|"reissue"|"burn"|"exchange"|"lease"|"lease_cancel"|"create_alias"|"mass_transfer"|"data_transaction"|"set_script"|"sponsor_fee"|"set_asset_script"|"invoke_script"|"update_asset_info";
}

export interface Transaction__Output {
  'chain_id': (number);
  'sender_public_key': (Buffer);
  'fee'?: (_waves_Amount__Output);
  'timestamp': (string);
  'version': (number);
  'genesis'?: (_waves_GenesisTransactionData__Output);
  'payment'?: (_waves_PaymentTransactionData__Output);
  'issue'?: (_waves_IssueTransactionData__Output);
  'transfer'?: (_waves_TransferTransactionData__Output);
  'reissue'?: (_waves_ReissueTransactionData__Output);
  'burn'?: (_waves_BurnTransactionData__Output);
  'exchange'?: (_waves_ExchangeTransactionData__Output);
  'lease'?: (_waves_LeaseTransactionData__Output);
  'lease_cancel'?: (_waves_LeaseCancelTransactionData__Output);
  'create_alias'?: (_waves_CreateAliasTransactionData__Output);
  'mass_transfer'?: (_waves_MassTransferTransactionData__Output);
  'data_transaction'?: (_waves_DataTransactionData__Output);
  'set_script'?: (_waves_SetScriptTransactionData__Output);
  'sponsor_fee'?: (_waves_SponsorFeeTransactionData__Output);
  'set_asset_script'?: (_waves_SetAssetScriptTransactionData__Output);
  'invoke_script'?: (_waves_InvokeScriptTransactionData__Output);
  'update_asset_info'?: (_waves_UpdateAssetInfoTransactionData__Output);
  'data': "genesis"|"payment"|"issue"|"transfer"|"reissue"|"burn"|"exchange"|"lease"|"lease_cancel"|"create_alias"|"mass_transfer"|"data_transaction"|"set_script"|"sponsor_fee"|"set_asset_script"|"invoke_script"|"update_asset_info";
}
