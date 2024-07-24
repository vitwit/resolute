'use client';

import { DelegationResponse, Params, Validator } from '@/types/staking';
import { parseBalance } from './denom';
import {
  MultisigThresholdPubkey,
  SinglePubkey,
  pubkeyToAddress,
} from '@cosmjs/amino';
import { Options } from '@/custom-hooks/useSortedAssets';
import {
  getAuthToken,
  getWalletName,
  removeAllAuthTokens,
} from './localStorage';
import { MultisigAddressPubkey } from '@/types/multisig';
import { fromBech32 } from '@cosmjs/encoding';
import { SUPPORTED_WALLETS } from './constants';
import { FAILED_TO_FETCH } from './errors';
import ReactGA from 'react-ga';

export const trackEvent = (category: string, action: string, label: string) => {
  ReactGA.event({
    category: category,
    action: action,
    label: label
  });
};

export const convertPaginationToParams = (
  pagination?: KeyLimitPagination
): string => {
  let result = '';
  if (!pagination) {
    return result;
  }
  if (pagination.key) {
    result += `pagination.key=${encodeURIComponent(pagination.key)}`;
  }
  if (pagination.key && pagination.limit) {
    result += `&`;
  }
  if (pagination.limit) {
    result += `pagination.limit=${pagination.limit}`;
  }
  return result;
};

export const convertPaginationToParamsOffset = (pagination: {
  offset: number | null | undefined;
  limit: number | null | undefined;
}): string => {
  let result = '';
  if (!pagination) {
    return '';
  }
  if (pagination.offset) {
    result += `pagination.offset=${pagination.offset}`;
  }
  if (pagination.offset && pagination.limit) {
    result += `&`;
  }
  if (pagination.limit) {
    result += `pagination.limit=${pagination.limit}`;
  }
  return result;
};

export const cleanURL = (url: string | undefined): string => {
  if (url?.length) {
    return url.replace(/\/+$/, '');
  }
  return '';
};

export const getSelectedPartFromURL = (urlParts: string[]): string => {
  if (urlParts.length === 1) return 'Overview';
  switch (urlParts[1]) {
    case 'staking':
      return 'Staking';
    case 'feegrant':
      return 'Feegrant';
    case 'governance':
      return 'Governance';
    case 'groups':
      return 'Groups';
    case 'authz':
      return 'Authz';
    case 'multisig':
      return 'Multisig';
    case 'transfers':
      return 'Transfers';
    case 'history':
      return 'History';
    case 'validator':
      return 'Staking';
    case 'cosmwasm':
      return 'Cosmwasm';
    case 'multiops':
      return 'Multiops';
    default:
      return 'Overview';
  }
};

export const capitalizeFirstLetter = (inputString: string): string => {
  if (inputString.length === 0) {
    return inputString;
  }

  const firstLetter = inputString.charAt(0).toUpperCase();
  const restOfString = inputString.slice(1);

  return firstLetter + restOfString;
};

export const formatDollarAmount = (amount: number): string => {
  if (amount === 0) return '$0';
  if (amount < 0.1) return '< $0.1';
  return (
    '$ ' +
    amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
  );
};

export const formatAmountToString = (amount: number): string => {
  if (amount === 0) return '0';
  if (amount < 0.1) return '< 0.1';
  return (
    amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
  );
};

export const formatAmount = (amount: number): string => {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

export const formatCoin = (amount: number, denom: string): string => {
  let parsedAmount;
  if (amount === 0) parsedAmount = '0';
  else if (amount < 0.01) parsedAmount = '< 0.01';
  else
    parsedAmount = amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  return parsedAmount + ' ' + denom;
};

export function formatNumber(number: number): string {
  if (number <= 999) return number + '';
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  const tier = (Math.log10(Math.abs(number)) / 3) | 0;

  if (tier === 0) return number.toString();

  const suffix = suffixes[tier];
  const scale = Math.pow(10, tier * 3);

  const scaledNumber = number / scale;

  const formattedNumber = parseFloat(scaledNumber.toFixed(2));

  return formattedNumber.toString() + suffix;
}

export const getDaysLeftString = (daysLeft: number): string => {
  return daysLeft === 1 ? `1 Day` : `${daysLeft} Days`;
};

export const getValidatorStatus = (jailed: boolean, status: string): string => {
  return jailed
    ? 'Jailed'
    : status === 'BOND_STATUS_UNBONDING'
      ? 'Unbonding'
      : 'Unbonded';
};

export function shortenMsg(Msg: string, maxCharacters: number) {
  return Msg.slice(0, maxCharacters) + '...';
}

export function shortenAddress(bech32: string, maxCharacters: number) {
  if (maxCharacters >= bech32?.length) {
    return bech32;
  }

  const i = bech32 ? bech32.indexOf('1') : -1;
  const prefix = bech32 ? bech32.slice(0, i) : '';
  const address = bech32 ? bech32.slice(i + 1) : '';

  maxCharacters -= prefix?.length;
  maxCharacters -= 3; // For "..."
  maxCharacters -= 1; // For "1"

  if (maxCharacters <= 0) {
    return '';
  }

  const mid = Math.floor(address?.length / 2);
  let former = address?.slice(0, mid);
  let latter = address?.slice(mid);

  while (maxCharacters < former?.length + latter?.length) {
    if ((former?.length + latter?.length) % 2 === 1 && former?.length > 0) {
      former = former.slice(0, former?.length - 1);
    } else {
      latter = latter.slice(1);
    }
  }

  return prefix + '1' + former + '...' + latter;
}

export const getValidatorRank = (
  validator: string,
  validatorsList: string[]
): string => {
  const index = validatorsList.indexOf(validator);
  if (index !== -1) {
    return '#' + String(index + 1);
  }
  return '#-';
};

export function convertSnakeToCamelCase(key: string): string {
  return key.replace(/_([a-z])/g, (match, group1) => group1.toUpperCase());
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function convertKeysToCamelCase(data: any): any {
  if (Array.isArray(data)) {
    return data.map(convertKeysToCamelCase);
  }

  if (typeof data === 'object' && data !== null) {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const convertedData: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      const cleanedKey = removeQuotesFromKey(key);
      const camelCaseKey = convertSnakeToCamelCase(cleanedKey);
      convertedData[camelCaseKey] = convertKeysToCamelCase(value);
      console.log(camelCaseKey);
    }
    return convertedData;
  }

  return data;
}

function removeQuotesFromKey(key: string): string {
  return key.replace(/"/g, '');
}

export const tabLink = (link: string, chainName: string): string => {
  return (
    (link === '/' && chainName.length ? '/overview' : link) + '/' + chainName
  );
};

export const allNetworksLink = (pathParts: string[]): string => {
  return pathParts[1] === 'overview' || pathParts[1] === ''
    ? '/'
    : pathParts[1] === 'validator'
      ? '/staking'
      : '/' + pathParts[1];
};

export const changeNetworkRoute = (
  pathName: string,
  chainName: string
): string => {
  const route = pathName === '/' ? '/overview' : '/' + pathName.split('/')?.[1];
  return `${route}/${chainName.toLowerCase()}`;
};

export function parseDelegation({
  delegations,
  validator,
  currency,
}: {
  delegations: DelegationResponse[];
  validator: Validator | undefined;
  currency: Currency;
}): number {
  let result = 0.0;
  delegations?.forEach((item) => {
    if (item.delegation.validator_address === validator?.operator_address) {
      if (currency && currency.coinDecimals) {
        result +=
          parseFloat(item.delegation.shares) / 10 ** currency?.coinDecimals;
      }
    }
  });

  return result;
}

export function canDelegate(validatorStatus: string): boolean {
  return validatorStatus.toLowerCase() !== 'jailed';
}

export function formatStakedAmount(tokens: Coin[], currency: Currency): string {
  const balance = parseBalance(
    tokens,
    currency.coinDecimals,
    currency.coinMinimalDenom
  );
  return formatCoin(balance, currency.coinDenom);
}

export function parseDenomAmount(
  balance: string,
  coinDecimals: number
): number {
  return parseFloat(balance) / 10.0 ** coinDecimals;
}

export function formatCommission(commission: number): string {
  return commission === 0
    ? '0%'
    : commission
      ? String(commission.toFixed(0)) + '%'
      : '-';
}

export function formatUnbondingPeriod(
  stakingParams: Params | undefined
): string {
  return stakingParams?.unbonding_time
    ? Math.floor(
      parseInt(stakingParams?.unbonding_time || '', 10) / (3600 * 24)
    ).toString()
    : '-';
}

export function NewMultisigThresholdPubkey(
  pubkeys: SinglePubkey[],
  threshold: string
): MultisigThresholdPubkey {
  return {
    type: 'tendermint/PubKeyMultisigThreshold',
    value: {
      pubkeys: pubkeys,
      threshold: threshold,
    },
  };
}
export const filterAsset = (
  asset: ParsedAsset | undefined,
  options: Options
) => {
  if (!asset) return false;
  let includedAsset = false;
  if (options.showAvailable && asset.balance) {
    includedAsset = true;
  }
  if (options.showValuedTokens && asset.usdValue) {
    includedAsset = true;
  }
  if (asset.type === 'ibc') return includedAsset;
  if (options.showRewards && asset.rewards) {
    includedAsset = true;
  }
  if (options.showStaked && asset.staked) {
    includedAsset = true;
  }
  return includedAsset;
};

export const isVerified = ({
  chainID,
  address,
}: {
  chainID: string;
  address: string;
}) => {
  const token = getAuthToken(chainID);
  if (token) {
    if (token.address === address && token.chainID === chainID) {
      return true;
    } else {
      removeAllAuthTokens();
      return false;
    }
  }
  return false;
};

export const isMultisigMember = (
  pubkeys: MultisigAddressPubkey[],
  walletAddress: string
): boolean => {
  const result = pubkeys?.filter((keys) => {
    return keys.address === walletAddress;
  });
  return !!result?.length;
};

export const getTxnURL = (
  explorerTxHashEndpoint: string,
  hash: string
): string => {
  return cleanURL(explorerTxHashEndpoint) + '/' + hash;
};

export const parseAmount = (amount: Coin[], currency: Currency) => {
  return formatCoin(
    parseBalance(amount, currency.coinDecimals, currency.coinMinimalDenom),
    currency.coinDenom
  );
};

export function getRandomNumber(min: number, max: number): number {
  const randomNumber = Math.random() * (max - min) + min;
  return Math.floor(randomNumber);
}

export const shortenName = (name: string, maxLength: number): string =>
  name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;

export const convertToSnakeCase = (name: string) => {
  return name.toLowerCase().replace(/ /g, '_') || '';
};

export function amountToMinimalValue(amount: number, coinDecimals: number) {
  return Number(amount) * 10 ** coinDecimals;
}

export function isMultisigAccountMember(
  walletAddress: string,
  pubKeys: PubKey[],
  prefix: string
): boolean {
  const result = pubKeys?.filter((pubKey) => {
    const address =
      pubkeyToAddress(
        {
          type: 'tendermint/PubKeySecp256k1',
          value: pubKey.key,
        },
        prefix
      ) || '';
    return walletAddress === address;
  });
  return result?.length !== 0;
}

export const validateAddress = (address: string) => {
  if (address?.length) {
    try {
      fromBech32(address);
      return true;
    } catch (error) {
      return false;
    }
  }
  return false;
};

export function getTypeURLName(url: string) {
  if (!url) {
    return '-';
  }
  const temp = url.split('.');
  if (temp?.length > 0) {
    const msg = temp[temp?.length - 1];
    return msg.slice(3, msg.length);
  }
  return '-';
}

/**
 * @example
 * Input: WithdrawDelegatorRewards
 * Output: Withdraw Delegator Rewards
 */
export function convertToSpacedName(camelCaseName: string): string {
  const spacedName = camelCaseName.replace(/([a-z])([A-Z])/g, '$1 $2');

  return spacedName.charAt(0).toUpperCase() + spacedName.slice(1);
}

export function formatValidatorStatsValue(
  value: number | string,
  precision: number
) {
  const numValue = Number(value);
  return isNaN(numValue)
    ? '-'
    : Number(numValue.toFixed(precision)).toLocaleString();
}

export function extractContractMessages(inputString: string): string[] {
  let errMsg = '';
  if (inputString.includes('expected')) {
    errMsg = inputString.split('expected')[1];
  } else if (inputString.includes('missing')) {
    errMsg = inputString.split('missing')[1];
  } else {
    errMsg = inputString;
  }
  const pattern: RegExp = /`(\w+)`/g;

  const matches: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(errMsg)) !== null) {
    matches.push(match[1]);
  }

  return matches;
}

export const getFormattedFundsList = (
  funds: FundInfo[],
  fundsInput: string,
  attachFundType: string
) => {
  if (attachFundType === 'select') {
    const result: {
      denom: string;
      amount: string;
    }[] = [];
    funds.forEach((fund) => {
      if (fund.amount.length) {
        result.push({
          denom: fund.denom,
          amount: (Number(fund.amount) * 10 ** fund.decimals).toString(),
        });
      }
    });
    return result;
  } else if (attachFundType === 'json') {
    try {
      const parsedFunds = JSON.parse(fundsInput);
      return parsedFunds;
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      console.log(error);
    }
  }
};

export const getConnectWalletLogo = () => {
  const wallets = SUPPORTED_WALLETS;
  const walletName = getWalletName();
  const wallet = wallets.find(
    (wallet) => wallet.name.toLowerCase() === walletName.toLowerCase()
  );

  return wallet ? wallet.logo : '';
};

export const isNetworkError = (errMsg: string) => {
  if (errMsg?.toLowerCase()?.includes(FAILED_TO_FETCH.toLowerCase()))
    return true;
  return false;
};

export const addChainIDParam = (uri: string, chainID: string) => {
  let updatedURI: string;
  if (uri.includes('?')) {
    updatedURI = `${uri}&chain=${chainID.toLowerCase()}`;
  } else {
    updatedURI = `${uri}?chain=${chainID.toLowerCase()}`;
  }
  return updatedURI;
};
