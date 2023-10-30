type Currency = {
    coinDenom: string;
    coinMinimalDenom: string;
    coinDecimals: number;
    coinGeckoId?: string;
    gasPriceStep?: GasPrice;
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
  
  type Theme = {
    primaryColor: string,
    gradient: string,
  }
  
  interface NetworkConfig {
    rpc: string;
    rest: string;
    chainId: string;
    chainName: string;
    stakeCurrency: StakeCurrency;
    walletUrlForStaking?: string;
    bip44: BIP44;
    bech32Config: Bech32Config;
    currencies: Currency[];
    feeCurrencies: Currency[];
    features?: string[];
    image: string;
    theme: Theme;
  }
  
  interface AirdropAction {
    type: string;
    title: string;
    redirect?: string;
  }
  
  interface AminoConfig {
    authz: boolean;
    feegrant: boolean;
    group: boolean;
  }
  
  interface EnableModule {
    authz: boolean;
    feegrant: boolean;
    group: boolean;
  }
  
  interface Network {
    showAirdrop: boolean;
    logos: Logos;
    keplrExperimental: boolean;
    leapExperimental: boolean;
    isTestnet: boolean;
    explorerTxHashEndpoint: string;
    config: NetworkConfig;
    airdropMessage?: string;
    airdropActions?: AirdropAction[];
    aminoConfig: AminoConfig;
    enableModules: EnableModule;
  }
  
  