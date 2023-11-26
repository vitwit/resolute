export const GAS_FEE = 860000;
// TODO: Add template url 
export const ADD_NETWORK_TEMPLATE_URL = "";
export const NETWORK_CONFIG_EMPTY = {
  enableModules: {
    authz: false,
    feegrant: false,
    group: false,
  },
  aminoConfig: {
    authz: false,
    feegrant: false,
    group: false,
  },
  showAirdrop: false,
  logos: {
    menu: '',
    toolbar: '',
  },
  keplrExperimental: false,
  leapExperimental: false,
  isTestnet: false,
  explorerTxHashEndpoint: '',
  config: {
    chainId: '',
    chainName: '',
    rest: '',
    rpc: '',
    currencies: [
      {
        coinDenom: '',
        coinMinimalDenom: '',
        coinDecimals: 0,
      },
    ],
    bech32Config: {
      bech32PrefixAccAddr: '',
      bech32PrefixAccPub: '',
      bech32PrefixValAddr: '',
      bech32PrefixValPub: '',
      bech32PrefixConsAddr: '',
      bech32PrefixConsPub: '',
    },
    feeCurrencies: [
      {
        coinDenom: '',
        coinMinimalDenom: '',
        coinDecimals: 0,
        gasPriceStep: {
          low: 0,
          average: 0,
          high: 0,
        },
      },
      {
        coinDenom: '',
        coinMinimalDenom: '',
        coinDecimals: 0,
        gasPriceStep: {
          low: 0,
          average: 0,
          high: 0,
        },
      },
    ],
    bip44: {
      coinType: 0,
    },
    stakeCurrency: {
      coinDenom: '',
      coinMinimalDenom: '',
      coinDecimals: 0,
    },
    image: '',
    theme: {
      primaryColor: '',
      gradient: '',
    },
  },
};
