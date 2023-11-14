interface CounterParty {
  channel: string;
  port: string;
  denom: string;
}

interface IBCAsset {
  denom: string;
  type: 'ibc';
  origin_chain: string;
  origin_denom: string;
  origin_type: string;
  symbol: string;
  decimals: number;
  enable: boolean;
  path: string;
  channel: string;
  port: string;
  counter_party: CounterParty;
  image: string;
  coinGeckoId: string;
}

interface NativeAsset {
  denom: string;
  type: 'staking' | 'pool';
  origin_chain: string;
  origin_denom: string;
  origin_type: string;
  symbol: string;
  decimals: number;
  description: string;
  image: string;
  coinGeckoId: string;
}

/* eslint-disable-next-line  @typescript-eslint/no-unused-vars */
interface AssetData {
  [key: string]: (NativeAsset | IBCAsset)[];
}
