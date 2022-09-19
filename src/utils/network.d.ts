type Currency = {
  coinDenom: string;
  coinMinimalDenom: string;
  coinDecimals: number;
  coinGeckoId?: string;
};

type Logos = { toolbar: string; menu: string };

type StakeCurrency = {
  coinDenom: string;
  coinMinimalDenom: string;
  coinDecimals: number;
  coinGeckoId?: string;
};

type BIP44 = { coinType: number };

type GasPrice = { low: number; average: number; high: number };

type Bech32Config = {
  bech32PrefixAccAddr: string;
  bech32PrefixAccPub: string;
  bech32PrefixValAddr: string;
  bech32PrefixValPub: string;
  bech32PrefixConsAddr: string;
  bech32PrefixConsPub: string;
};

interface NetworkConfig {
  chainId: string;
  chainName: string;
  rest: string;
  rpc: string;
  stakeCurrency?: StakeCurrency;
  bip44?: BIP44;
  bech32Config: Bech32Config;
  currencies: Currency[];
  feeCurrencies?: Currency[];
  coinType?: number;
  gasPriceStep: GasPrice;
  walletUrlForStaking?: string;
}

interface AirdropAction {
  type: string;
  title: string;
  redirect?: string;
}

interface Network {
  showAirdrop: boolean;
  logos: Logos;
  experimental: boolean;
  isTestnet: boolean;
  explorerTxHashEndpoint: string;
  config: NetworkConfig;
  airdropMessage?: string;
  airdropActions?: AirdropAction[];
}
