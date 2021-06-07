// Original file: src/waves/block.proto

import type { MicroBlock as _waves_MicroBlock, MicroBlock__Output as _waves_MicroBlock__Output } from '../waves/MicroBlock';

export interface SignedMicroBlock {
  'micro_block'?: (_waves_MicroBlock);
  'signature'?: (Buffer | Uint8Array | string);
  'total_block_id'?: (Buffer | Uint8Array | string);
}

export interface SignedMicroBlock__Output {
  'micro_block'?: (_waves_MicroBlock__Output);
  'signature': (Buffer);
  'total_block_id': (Buffer);
}
