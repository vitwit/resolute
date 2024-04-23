interface TxExecuteMultiMsgInputs {
  msgs: Msg[];
  memo: string;
  basicChainInfo: BasicChainInfo;
  denom: string;
  rpc: string;
  rest: string;
  aminoConfig: AminoConfig;
  prefix: string;
  feeAmount: number;
  feegranter: string;
  gas: number;
  address: string;
}

interface TxnMsgProps {
  msg: Msg;
  onDelete: (index: number) => void;
  currency: Currency;
  index: number;
}
