// Original file: src/waves/assets_api.proto

import type * as grpc from '@grpc/grpc-js'
import type { AssetInfoResponse as _waves_node_grpc_AssetInfoResponse, AssetInfoResponse__Output as _waves_node_grpc_AssetInfoResponse__Output } from '../../../waves/node/grpc/AssetInfoResponse';
import type { AssetRequest as _waves_node_grpc_AssetRequest, AssetRequest__Output as _waves_node_grpc_AssetRequest__Output } from '../../../waves/node/grpc/AssetRequest';
import type { NFTRequest as _waves_node_grpc_NFTRequest, NFTRequest__Output as _waves_node_grpc_NFTRequest__Output } from '../../../waves/node/grpc/NFTRequest';
import type { NFTResponse as _waves_node_grpc_NFTResponse, NFTResponse__Output as _waves_node_grpc_NFTResponse__Output } from '../../../waves/node/grpc/NFTResponse';

export interface AssetsApiClient extends grpc.Client {
  GetInfo(argument: _waves_node_grpc_AssetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_AssetInfoResponse__Output) => void): grpc.ClientUnaryCall;
  GetInfo(argument: _waves_node_grpc_AssetRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_AssetInfoResponse__Output) => void): grpc.ClientUnaryCall;
  GetInfo(argument: _waves_node_grpc_AssetRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_AssetInfoResponse__Output) => void): grpc.ClientUnaryCall;
  GetInfo(argument: _waves_node_grpc_AssetRequest, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_AssetInfoResponse__Output) => void): grpc.ClientUnaryCall;
  getInfo(argument: _waves_node_grpc_AssetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_AssetInfoResponse__Output) => void): grpc.ClientUnaryCall;
  getInfo(argument: _waves_node_grpc_AssetRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_AssetInfoResponse__Output) => void): grpc.ClientUnaryCall;
  getInfo(argument: _waves_node_grpc_AssetRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_AssetInfoResponse__Output) => void): grpc.ClientUnaryCall;
  getInfo(argument: _waves_node_grpc_AssetRequest, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_AssetInfoResponse__Output) => void): grpc.ClientUnaryCall;
  
  GetNFTList(argument: _waves_node_grpc_NFTRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_waves_node_grpc_NFTResponse__Output>;
  GetNFTList(argument: _waves_node_grpc_NFTRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_waves_node_grpc_NFTResponse__Output>;
  getNftList(argument: _waves_node_grpc_NFTRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_waves_node_grpc_NFTResponse__Output>;
  getNftList(argument: _waves_node_grpc_NFTRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_waves_node_grpc_NFTResponse__Output>;
  
}

export interface AssetsApiHandlers extends grpc.UntypedServiceImplementation {
  GetInfo: grpc.handleUnaryCall<_waves_node_grpc_AssetRequest__Output, _waves_node_grpc_AssetInfoResponse>;
  
  GetNFTList: grpc.handleServerStreamingCall<_waves_node_grpc_NFTRequest__Output, _waves_node_grpc_NFTResponse>;
  
}
