interface TransferRequestInputs {
  cosmosAddress: string;
  sourceDenom: string;
  sourceChainID: string;
  destChainID: string;
  sourceChain: string;
  destChain: string;
  from: string;
  to: string;
  amount: string;
  rest: string;
  rpc?: string;
  restURLs: string[];
}
