import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';

export function formatVotingPower(token: number, coinDecimals: number): string {
  const temp = token / 10.0 ** coinDecimals;
  return `${parseFloat(temp.toFixed(2)).toLocaleString()}`;
}

export function parseSpendLimit(tokens: Coin[], coinDecimals: number): number {
  if (tokens.length > 0) {
    const temp = Number(tokens[0].amount) / 10.0 ** coinDecimals;
    return parseFloat(temp.toFixed(coinDecimals));
  }

  return 0;
}

export function parseTokens(
  tokens: Coin[],
  displayName: string,
  coinDecimals: number
): string {
  if (!tokens) {
    return '0.0';
  }

  if (tokens.length === 0) {
    return '0.0';
  }

  return `${parseFloat(
    (Number(tokens[0]?.amount) / 10.0 ** coinDecimals).toFixed(coinDecimals)
  )} ${displayName}`;
}

export function parseBalance(
  tokens: Coin[],
  coinDecimals: number,
  minimalDenom: string
): number {
  if (!tokens) {
    return 0.0;
  }

  const precision = coinDecimals > 6 ? 6 : coinDecimals;
  if (tokens?.length === 0) {
    return 0.0;
  }

  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].denom === minimalDenom) {
      return parseFloat(
        (Number(tokens[i].amount) / 10.0 ** coinDecimals).toFixed(precision)
      );
    }
  }

  return 0.0;
}

export function getDenomBalance(tokens: Coin[], denom: string): number {
  if (tokens && tokens.length === 0) {
    return 0.0;
  }

  if (tokens) {
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].denom === denom) return parseFloat(tokens[i].amount);
    }
  }

  return 0.0;
}

export const formatNumber = (number: number): string => {
  return (
    number?.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) || 'N/A'
  );
};

export const getTotalAmount = (
  originDenomInfo: OriginDenomInfo,
  msgs: Msg[]
) => {
  let totalAmount = 0;
  msgs.forEach((msg) => {
    const parsedAmount = parseBalance(
      msg.value.amount,
      originDenomInfo.decimals,
      msg.value.amount[0].denom
    );
    totalAmount += parsedAmount;
  });
  return totalAmount.toFixed(6);
};

export const checkForIBCTokens = (balance: Coin[], nativeMinimalDenom: string) => {
  if (!balance?.length) {
    return false;
  }
  if (balance?.length === 1) {
    if (balance[0].denom === nativeMinimalDenom) {
      return false;
    } else {
      return true;
    }
  }
  return true;
};
