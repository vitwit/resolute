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
}

interface AddTransanctionInputs {
  transactions: Transaction[];
  address: string;
  chainID: string;
}

interface LoadTransactionsInputs {
  chains: {
    chainID: string;
    address: string;
  }[];
}
