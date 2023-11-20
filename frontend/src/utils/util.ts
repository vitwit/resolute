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

export const dispayAmount = (amount: number): string => {
  if (amount === 0) return '$ 0';
  if (amount < 0.001) return '< $ 0.001';
  return '$ ' + amount.toFixed(3);
};
