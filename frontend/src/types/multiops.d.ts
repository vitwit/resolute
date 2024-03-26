interface TxExecuteMultiMsgInputs {
  msgs: Msg[];
  memo: string;
  basicChainInfo: BasicChainInfo;
  denom: string;
  chainID: string;
  rpc: string;
  rest: string;
  aminoConfig: AminoConfig;
  prefix: string;
  feeAmount: number;
  feegranter: string;
  gas: number;
}
