interface BasicChainInfo {
  restURLs: string[];
  baseURL: string;
  chainID: string;
  aminoConfig: AminoConfig;
  rest: string;
  rpc: string;
  cosmosAddress: string;
  address: string;
  prefix: string;
  feeAmount: number;
  feeCurrencies: Currency[];
  explorerTxHashEndpoint: string;
  chainName: string;
  chainLogo: string;
  decimals: number;
}

interface Coin {
  amount: string;
  denom: string;
}
