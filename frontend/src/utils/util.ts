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
  return '$ ' + amount.toFixed(2);
};

export const formatAmount = (amount: number): string => {
  return amount === 0 ? '0' : amount.toFixed(2);
};

export const formatCoin = (amount: number, denom: string): string => {
  let parsedAmount;
  if (amount === 0) parsedAmount = '0';
  else if (amount < 0.01) parsedAmount = '< 0.01';
  else parsedAmount = amount.toFixed(2);
  return parsedAmount + ' ' + denom;
};
