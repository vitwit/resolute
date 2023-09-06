import chainDenoms from "./chainDenoms.json";

export const getIBCChains = (chainName = "") => {
  const denoms = chainDenoms?.[chainName.toLowerCase()]?.filter(
    (chainDenom) => {
      if (chainDenom["type"] === "ibc") {
        return chainDenom;
      }
    }
  );
  return denoms || [];
};

export const getIBCBalances = (balances = [], chainName = "") => {
  const IBCBalances = chainDenoms?.[chainName.toLowerCase()]?.filter(
    (chainDenom) => {
      for (let i = 0; i < balances.length; i++) {
        if (chainDenom["denom"] === balances[i]["denom"]) {
          chainDenom.amount = balances[i]["amount"];
          return chainDenom;
        }
      }
      if (chainDenom["type"] === "staking") {
        chainDenom.amount = 0;
        return chainDenom;
      }
    }
  );
  return IBCBalances || [];
};

export const getIBCChainsInfo = (balances = {}, nameToChainIds = {}) => {
  let IBCChainsInfo = {};
  for (let chainName of Object.keys(nameToChainIds)) {
    const chainID = nameToChainIds[chainName];
    if (!chainDenoms[chainName]) continue;
    let connectedChains = {};
    let ownedAssets = {};
    for (let IBCAsset of chainDenoms[chainName]) {
      IBCAsset["amount"] = 0;
      if (IBCAsset["type"] === "staking") {
        ownedAssets[IBCAsset["denom"]] = IBCAsset;
      }
      for (let balance of balances?.[chainID]?.list || []) {
        if (balance["denom"] === IBCAsset["denom"]) {
          IBCAsset["amount"] = balance.amount;
          ownedAssets[IBCAsset["denom"]] = IBCAsset;
          break;
        }
      }
      if (IBCAsset["type"] === "staking") continue;
      if (!IBCAsset["port"]) continue;
      connectedChains[IBCAsset["origin_chain"]] = {
        port: IBCAsset["port"],
        channel: IBCAsset["channel"],
      };
    }
    IBCChainsInfo[chainName] = { connectedChains, ownedAssets };
  }
  return IBCChainsInfo;
};
