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

interface AddTransanctionInputs {
  transactions: Transaction[];
  address: string;
  chainID: string;
}

interface LoadTransactionsInputs {
  address: string;
}

interface UpdateIBCTransactionInputs {
  txHash: string;
  address: string;
  chainID: string;
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
