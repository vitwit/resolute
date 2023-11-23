interface BasicChainInfo {
  baseURL: string;
  chainID: string;
  aminoConfig: AminoConfig;
  rest: string;
  rpc: string;
}

interface Coin {
  amount: string;
  denom: string;
}
