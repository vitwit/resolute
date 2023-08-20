export const defaultValues = {
  chainConfig: {
    chainName: "",
    chainID: "",
    restEndpoint: "",
    rpcEndpoint: "",
    isTestnet: "",
    logo: "",
  },
  currency: {
    coinDenom: "",
    coinMinimalDenom: "",
    decimals: "",
  },
  accAddressPerfix: "",
  feeCurrency: {
    coinDenom: "",
    coinMinimalDenom: "",
    decimals: "",
  },
  gasPriceStep: {
    low: 0.01,
    average: 0.025,
    high: 0.03,
  },
  coinType: 118,
  stakeCurrency: {
    coinDenom: "",
    coinMinimalDenom: "",
    decimals: "",
  },
  explorerEndpoint: "",
  enableModules: {
    authz: "",
    feegrant: "",
    groups: "",
  },
  aminoConfig: {
    authz: "",
    feegrant: "",
    groups: "No",
  },
  wallet: {
    keplrExperimental: "",
    leapExperimental: "",
  },
};

const chainInfo = {
  enable_modules: {
    authz: null,
    feegrant: null,
    group: null,
  },
  amino_config: {
    authz: null,
    feegrant: null,
    group: false,
  },
  show_airdrop: null,
  logos: {
    menu: null,
    toolbar:
      "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/cosmoshub/images/cosmoshub-logo.png",
  },
  keplr_experimental: null,
  leap_experimental: null,
  is_testnet: null,
  explorer_tx_hash_endpoint: null,
  config: {
    chain_id: null,
    chain_name: null,
    rest: null,
    rpc: null,
    currencies: [
      {
        coin_denom: null,
        coin_minimal_denom: null,
        coin_decimals: null,
      },
    ],
    bech32_config: {
      bech32_prefix_acc_addr: null,
      bech32_prefix_acc_pub: null,
      bech32_prefix_val_addr: null,
      bech32_prefix_val_pub: null,
      bech32_prefix_cons_addr: null,
      bech32_prefix_cons_pub: null,
    },
    fee_currencies: [
      {
        coin_denom: null,
        coin_minimal_denom: null,
        coin_decimals: null,
        gas_price_step: {
          low: null,
          average: null,
          high: null,
        },
      },
    ],
    bip44: {
      coin_type: null,
    },
    stake_currency: {
      coin_denom: null,
      coin_minimal_denom: null,
      coin_decimals: null,
    },
    image:
      "https://raw.githubusercontent.com/leapwallet/assets/2289486990e1eaf9395270fffd1c41ba344ef602/images/logo.svg",
    theme: {
      primary_color: "#fff",
      gradient:
        "linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 100%)",
    },
  },
};

export const validateSpaces = (value) => {
  if (value?.match(" ")) {
    return true;
  }
  return false;
};

export const validInteger = (value) => {
  var re = /^\d*$/;
  if (re.test(value)) {
    return true;
  }
  return false;
};

export const getRequiredMsg = (value) => {
  return value + " is required";
};

export const getNoSpacesMsg = (value) => {
  return value + " should not contain spaces in between";
};

export const addNetwork = (data) => {
  
};
