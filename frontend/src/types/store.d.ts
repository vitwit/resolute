export enum TxStatus {
  INIT = '',
  PENDING = 'pending',
  IDLE = 'idle',
  REJECTED = 'rejected',
}

interface BasicChainInfo {
  baseURL: string;
  chainID: string;
  aminoConfig: AminoConfig;
  rest: string;
  rpc: string;
}

export interface Msg {
  typeUrl: string
  value: any
}
