interface ChainConfig {
  label: string;
  logoURI: string;
  chainID: string;
}

interface AssetConfig {
  label: string;
  symbol: string;
  logoURI: string;
  denom: string;
  decimals: number;
}

interface SwapState {
  sourceChain: ChainConfig | null;
  sourceAsset: AssetConfig | null;
  destChain: ChainConfig | null;
  destAsset: AssetConfig | null;
  amountIn: string;
  amountOut: string;
}
