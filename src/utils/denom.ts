import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";

export function formatVotingPower(token: number, coinDecimals: number): string {
  let temp = token / 10.0 ** coinDecimals;
  return `${parseFloat(temp.toFixed(2)).toLocaleString()}`;
}

export function parseSpendLimit(tokens: any[], coinDecimals: number): number {
  if (tokens.length > 0) {
    let temp = tokens[0].amount / 10.0 ** coinDecimals;
    return parseFloat(temp.toFixed(coinDecimals));
  }

  return 0;
}

export function parseTokens(
  tokens: Coin[],
  displayName: string,
  coinDecimals: number
): string {
  if (tokens.length == 0) {
    return "0.0";
  }

  return `${parseFloat(
    (Number(tokens[0].amount) / 10.0 ** coinDecimals).toFixed(coinDecimals)
  )} ${displayName}`;
}

export function parseBalance(
  tokens: Coin[],
  coinDecimals: number,
  minimalDenom: string
): number {
  if (tokens.length == 0) {
    return 0.0;
  }

  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].denom === minimalDenom) {
      return parseFloat(
        (Number(tokens[i].amount) / 10.0 ** coinDecimals).toFixed(coinDecimals)
      );
    }
  }

  return 0.0;
}
