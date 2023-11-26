interface MultiTxnsInputs {
  basicChainInfo: BasicChainInfo;
  address: string;
  msgs: Msg[];
  prefix: string;
  memo: string;
  feeAmount: number;
  denom: string;
  feegranter: string;
}

interface TxSendInputs {
  basicChainInfo: BasicChainInfo;
  from: string;
  to: string;
  amount: number;
  denom: string;
  feeAmount: number;
  feegranter: string;
  memo: string;
  prefix: string;
}
