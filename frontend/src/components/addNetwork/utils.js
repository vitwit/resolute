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
  enableModules: {},
  aminoConfig: {},
  showAirdrop: false,
  logos: {
    menu: null,
    toolbar:
      "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/cosmoshub/images/cosmoshub-logo.png",
  },
  keplrExperimental: null,
  leapExperimental: null,
  isTestnet: null,
  explorerTxHashEndpoint: null,
  config: {
    chainId: null,
    chainName: null,
    rest: null,
    rpc: null,
    currencies: [],
    bech32Config: {},
    feeCurrencies: [],
    bip44: {
      coinType: null,
    },
    stakeCurrency: {},
    image:
      "https://raw.githubusercontent.com/leapwallet/assets/2289486990e1eaf9395270fffd1c41ba344ef602/images/logo.svg",
    theme: {
      primaryColor: "#fff",
      gradient:
        "linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 100%)",
    },
  },
};

export const CHAINCONFIG_CHAIN_NAME = "chainConfig.chainName";
export const CHAINCONFIG_CHAIN_ID = "chainConfig.chainID";
export const CHAINCONFIG_REST_ENDPOINT = "chainConfig.restEndpoint";
export const CHAINCONFIG_RPC_ENDPOINT = "chainConfig.rpcEndpoint";
export const CHAINCONFIG_LOGO = "chainConfig.logo";
export const CURRENCY_COIN_DENOM = "currency.coinDenom";
export const CURRENCY_COIN_MINIMAL_DENOM = "currency.coinMinimalDenom";
export const CURRENCY_DECIAMLS = "currency.decimals";
export const ACC_ADDRESS_PREFIX = "accAddressPerfix";
export const FEE_CURRENCY_COIN_DENOM = "feeCurrency.coinDenom";
export const FEE_CURRENCY_COIN_MINIMAL_DENOM = "feeCurrency.coinMinimalDenom";
export const FEE_CURRENCY_DECIAMLS = "feeCurrency.decimals";
export const GAS_PRICE_STEP_LOW = "gasPriceStep.low";
export const GAS_PRICE_STEP_AVG = "gasPriceStep.average";
export const GAS_PRICE_STEP_HIGH = "gasPriceStep.high";
export const COIN_TYPE = "coinType";
export const STAKE_CURRENCY_COIN_DENOM = "stakeCurrency.coinDenom";
export const STAKE_CURRENCY_COIN_MINIMAL_DENOM =
  "stakeCurrency.coinMinimalDenom";
export const STAKE_CURRENCY_DECIAMLS = "stakeCurrency.decimals";
export const EXPLORER_ENDPOINT = "explorerEndpoint";

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

  chainInfo.enableModules = {
    authz: parseValue(data.enableModules.authz),
    feegrant: parseValue(data.enableModules.feegrant),
    group: parseValue(data.enableModules.group),
  };
  chainInfo.aminoConfig = {
    authz: parseValue(data.aminoConfig.authz),
    feegrant: parseValue(data.aminoConfig.feegrant),
    group: false,
  };
  chainInfo.logos.menu = data.chainConfig.logo.trim();
  chainInfo.keplrExperimental = parseValue(data.wallet.keplrExperimental);
  chainInfo.leapExperimental = parseValue(data.wallet.leapExperimental);
  chainInfo.isTestnet = parseValue(data.chainConfig.isTestnet);
  chainInfo.explorerTxHashEndpoint = data.explorerEndpoint.trim();
  chainInfo.config.chainId = data.chainConfig.chainID.trim();
  chainInfo.config.chainName = data.chainConfig.chainName.trim();
  chainInfo.config.rest = data.chainConfig.restEndpoint.trim();
  chainInfo.config.rpc = data.chainConfig.rpcEndpoint.trim();
  chainInfo.config.currencies = [
    {
      coinDenom: data.currency.coinDenom.trim(),
      coinMinimalDenom: data.currency.coinMinimalDenom.trim(),
      coinDecimals: data.currency.decimals,
    },
  ];
  const accAddressPerfix = data.accAddressPerfix.trim();
  chainInfo.config.bech32Config = {
    bech32PrefixAccAddr: accAddressPerfix,
    bech32PrefixAccPub: accAddressPerfix + "pub",
    bech32PrefixValAddr: accAddressPerfix + "valoper",
    bech32PrefixValPub: accAddressPerfix + "valoperpub",
    bech32PrefixConsAddr: accAddressPerfix + "gvalcons",
    bech32PrefixConsPub: accAddressPerfix + "valconspub",
  };
  chainInfo.config.feeCurrencies = [
    {
      coinDenom: data.feeCurrency.coinDenom.trim(),
      coinMinimalDenom: data.feeCurrency.coinMinimalDenom.trim(),
      coinDecimals: data.feeCurrency.decimals,
      gasPriceStep: data.gasPriceStep,
    },
  ];
  chainInfo.config.bip44.coinType = data.coinType;
  chainInfo.config.stakeCurrency = {
    coinDenom: data.stakeCurrency.coinDenom.trim(),
    coinMinimalDenom: data.stakeCurrency.coinMinimalDenom.trim(),
    coinDecimals: data.stakeCurrency.decimals,
  };

  setNetwork(chainInfo);
};
