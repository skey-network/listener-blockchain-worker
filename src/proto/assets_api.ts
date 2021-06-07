import type * as grpc from '@grpc/grpc-js';
import type { ServiceDefinition, EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { AccountsApiClient as _waves_node_grpc_AccountsApiClient } from './waves/node/grpc/AccountsApi';
import type { AssetsApiClient as _waves_node_grpc_AssetsApiClient } from './waves/node/grpc/AssetsApi';
import type { TransactionsApiClient as _waves_node_grpc_TransactionsApiClient } from './waves/node/grpc/TransactionsApi';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  google: {
    protobuf: {
      BoolValue: MessageTypeDefinition
      BytesValue: MessageTypeDefinition
      DoubleValue: MessageTypeDefinition
      FloatValue: MessageTypeDefinition
      Int32Value: MessageTypeDefinition
      Int64Value: MessageTypeDefinition
      StringValue: MessageTypeDefinition
      UInt32Value: MessageTypeDefinition
      UInt64Value: MessageTypeDefinition
    }
  }
  waves: {
    Amount: MessageTypeDefinition
    AssetPair: MessageTypeDefinition
    BurnTransactionData: MessageTypeDefinition
    CreateAliasTransactionData: MessageTypeDefinition
    DataTransactionData: MessageTypeDefinition
    ExchangeTransactionData: MessageTypeDefinition
    GenesisTransactionData: MessageTypeDefinition
    InvokeScriptResult: MessageTypeDefinition
    InvokeScriptTransactionData: MessageTypeDefinition
    IssueTransactionData: MessageTypeDefinition
    LeaseCancelTransactionData: MessageTypeDefinition
    LeaseTransactionData: MessageTypeDefinition
    MassTransferTransactionData: MessageTypeDefinition
    Order: MessageTypeDefinition
    PaymentTransactionData: MessageTypeDefinition
    Recipient: MessageTypeDefinition
    ReissueTransactionData: MessageTypeDefinition
    SetAssetScriptTransactionData: MessageTypeDefinition
    SetScriptTransactionData: MessageTypeDefinition
    SignedTransaction: MessageTypeDefinition
    SponsorFeeTransactionData: MessageTypeDefinition
    Transaction: MessageTypeDefinition
    TransferTransactionData: MessageTypeDefinition
    UpdateAssetInfoTransactionData: MessageTypeDefinition
    node: {
      grpc: {
        AccountRequest: MessageTypeDefinition
        AccountsApi: SubtypeConstructor<typeof grpc.Client, _waves_node_grpc_AccountsApiClient> & { service: ServiceDefinition }
        ApplicationStatus: EnumTypeDefinition
        AssetInfoResponse: MessageTypeDefinition
        AssetRequest: MessageTypeDefinition
        AssetsApi: SubtypeConstructor<typeof grpc.Client, _waves_node_grpc_AssetsApiClient> & { service: ServiceDefinition }
        BalanceResponse: MessageTypeDefinition
        BalancesRequest: MessageTypeDefinition
        CalculateFeeResponse: MessageTypeDefinition
        DataEntryResponse: MessageTypeDefinition
        DataRequest: MessageTypeDefinition
        InvokeScriptResultResponse: MessageTypeDefinition
        NFTRequest: MessageTypeDefinition
        NFTResponse: MessageTypeDefinition
        ScriptData: MessageTypeDefinition
        SignRequest: MessageTypeDefinition
        TransactionResponse: MessageTypeDefinition
        TransactionStatus: MessageTypeDefinition
        TransactionsApi: SubtypeConstructor<typeof grpc.Client, _waves_node_grpc_TransactionsApiClient> & { service: ServiceDefinition }
        TransactionsByIdRequest: MessageTypeDefinition
        TransactionsRequest: MessageTypeDefinition
      }
    }
  }
}
