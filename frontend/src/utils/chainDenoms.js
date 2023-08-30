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
