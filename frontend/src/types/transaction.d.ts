interface Transaction {
  code: number;
  height: string;
  rawLog: string;
  transactionHash: string;
  gasUsed: string;
  gasWanted: string;
  fee: Coin[];
  time: string;
  msgs: Msg[];
  chainID: string;
  address: string;
  memo: string;
  isIBC: boolean;
  isIBCPending: boolean;
}

interface UiTx {
  showMsgs: [string, string, boolean];
  isTxSuccess: boolean;
  time: string;
  firstMessage: string;
  msgCount: number;
  showTx: boolean;
  isIBC: boolean;
  isIBCPending: boolean;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ParsedTransaction {
  code: number;
  gas_used: string;
  gas_wanted: string;
  height: string;
  raw_log: string;
  timestamp: string;
  memo: string;
  messages: any[];
  chain_id: string;
  fee: Coin[];
  address: string;
  txhash: string;
  isIBCTxn: boolean;
  isIBCPending: boolean;
}
