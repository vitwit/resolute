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
    default:
      return 'Overview';
  }
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

export function shortenMsg(Msg: string, maxCharacters: number) {
  return Msg.slice(0, maxCharacters) + '...';
}

export function shortenAddress(bech32: string, maxCharacters: number) {
  if (maxCharacters >= bech32?.length) {
    return bech32;
  }

  const i = bech32.indexOf('1');
  const prefix = bech32.slice(0, i);
  const address = bech32.slice(i + 1);

  maxCharacters -= prefix?.length;
  maxCharacters -= 3; // For "..."
  maxCharacters -= 1; // For "1"

  if (maxCharacters <= 0) {
    return '';
  }

  const mid = Math.floor(address?.length / 2);
  let former = address.slice(0, mid);
  let latter = address.slice(mid);

  while (maxCharacters < former?.length + latter?.length) {
    if ((former?.length + latter?.length) % 2 === 1 && former?.length > 0) {
      former = former.slice(0, former?.length - 1);
    } else {
      latter = latter.slice(1);
    }
  }

  return prefix + '1' + former + '...' + latter;
}

function convertSnakeToCamelCase(key: string): string {
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
