interface MultiTxnsInputs {
  basicChainInfo: BasicChainInfo;
  msgs: Msg[];
  memo: string;
  denom: string;
  feegranter: string;
}

interface TxSendInputs {
  basicChainInfo: BasicChainInfo;
  from: string;
  to: string;
  amount: number;
  assetDenom: string;
  denom: string;
  feeAmount: number;
  feegranter: string;
  memo: string;
  prefix: string;
  rpc?:string;
  onTxSuccessCallBank?: () => void;
}
