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
    low: "",
    average: "",
    high: "",
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
