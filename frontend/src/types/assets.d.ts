interface ParsedIBCAsset {
  type: 'ibc';
  usdValue: number;
  usdPrice: number;
  inflation: number;
  balance: number;
  chainName: string;
  chainID: string;
  denomInfo: (IBCAsset | NativeAsset)[];
  displayDenom: string;
  denom: string;
  chainLogoURL: string;
  decimals: number;
}

interface ParsedNativeAsset {
  type: 'native';
  usdValue: number;
  usdPrice: number;
  inflation: number;
  balance: number;
  staked: number;
  rewards: number;
  chainID: string;
  chainName: string;
  displayDenom: string;
  denom: string;
  chainLogoURL: string;
  decimals: number;
}

type ParsedAsset = ParsedIBCAsset | ParsedNativeAsset;
