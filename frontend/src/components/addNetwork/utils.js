import { setNetwork } from "../../utils/localStorage";

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
    group: "",
  },
  aminoConfig: {
    authz: "",
    feegrant: "",
    group: "No",
  },
  wallet: {
    keplrExperimental: "",
    leapExperimental: "",
  },
};

const chainInfo = {
  enable_modules: {},
  amino_config: {},
  show_airdrop: false,
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
    currencies: [],
    bech32_config: {},
    fee_currencies: [],
    bip44: {
      coin_type: null,
    },
    stake_currency: {},
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
  const parseValue = (value) => {
    if (value === "Yes") {
      return true;
    }
    return false;
  };

  chainInfo.enable_modules = {
    authz: parseValue(data.enableModules.authz),
    feegrant: parseValue(data.enableModules.feegrant),
    group: parseValue(data.enableModules.group),
  };
  chainInfo.amino_config = {
    authz: parseValue(data.aminoConfig.authz),
    feegrant: parseValue(data.aminoConfig.feegrant),
    group: false,
  };
  chainInfo.logos.menu = data.chainConfig.logo;
  chainInfo.keplr_experimental = parseValue(data.wallet.keplrExperimental);
  chainInfo.leap_experimental = parseValue(data.wallet.leapExperimental);
  chainInfo.is_testnet = parseValue(data.chainConfig.isTestnet);
  chainInfo.explorer_tx_hash_endpoint = data.explorerEndpoint;
  chainInfo.config.chain_id = data.chainConfig.chainID;
  chainInfo.config.chain_name = data.chainConfig.chainName;
  chainInfo.config.rest = data.chainConfig.restEndpoint;
  chainInfo.config.rpc = data.chainConfig.rpcEndpoint;
  chainInfo.config.currencies = [
    {
      coin_denom: data.currency.coinDenom,
      coin_minimal_denom: data.currency.coinMinimalDenom,
      coin_decimals: data.currency.decimals,
    },
  ];
  const accAddressPerfix = data.accAddressPerfix;
  chainInfo.config.bech32_config = {
    bech32_prefix_acc_addr: accAddressPerfix,
    bech32_prefix_acc_pub: accAddressPerfix + "pub",
    bech32_prefix_val_addr: accAddressPerfix + "valoper",
    bech32_prefix_val_pub: accAddressPerfix + "valoperpub",
    bech32_prefix_cons_addr: accAddressPerfix + "gvalcons",
    bech32_prefix_cons_pub: accAddressPerfix + "valconspub",
  };
  chainInfo.config.fee_currencies = [
    {
      coin_denom: data.feeCurrency.coinDenom,
      coin_minimal_denom: data.feeCurrency.coinMinimalDenom,
      coin_decimals: data.feeCurrency.decimals,
      gas_price_step: data.gasPriceStep,
    },
  ];
  chainInfo.config.bip44.coin_type = data.coinType;
  chainInfo.config.stake_currency = {
    coin_denom: data.stakeCurrency.coinDenom,
    coin_minimal_denom: data.stakeCurrency.coinMinimalDenom,
    coin_decimals: data.stakeCurrency.decimals,
  };

  console.log(JSON.stringify(chainInfo));
  setNetwork(chainInfo);
};
