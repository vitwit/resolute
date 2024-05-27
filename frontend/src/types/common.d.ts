interface ErrorState {
  message: string;
  type: string;
}

interface TxSuccess {
  hash: string;
  tx?: Transaction;
}

interface TxLoadRes {
  load: boolean;
}

interface TokenInfo {
  usd: number;
  usd_24h_change: number;
}

interface InfoState {
  denom: string;
  coingecko_name: string;
  enabled: boolean;
  last_updated: string;
  info: TokenInfo;
}

interface TokensInfoState {
  error: string;
  info: InfoState;
  status: string;
}

interface SelectedNetwork {
  chainName: string;
}

interface AllTokensInfoState {
  error: string;
  info: Record<string, InfoState>;
  status: string;
}

interface CommonState {
  errState: ErrorState;
  txSuccess: TxSuccess;
  txLoadRes: TxLoadRes;
  tokensInfoState: TokensInfoState;
  selectedNetwork: SelectedNetwork;
  allTokensInfoState: AllTokensInfoState;
  allNetworksInfo: Record<string, Network>;
  changeNetworkDialog: {
    open: boolean;
    showSearch: boolean;
  };
}
