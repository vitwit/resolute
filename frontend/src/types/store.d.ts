interface BasicChainInfo {
  baseURL: string;
  chainID: string;
  aminoConfig: AminoConfig;
  rest: string;
  rpc: string;
  cosmosAddress: string;
  address: string;
  prefix: string;
  feeAmount: number;
  chainName: string;
}

interface Coin {
  amount: string;
  denom: string;
}
