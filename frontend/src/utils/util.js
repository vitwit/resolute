export const convertPaginationToParams = (pagination) => {
  let result = '';
  if (!pagination || (!pagination.key && !pagination.limit)) {
    return '';
  }
  if (pagination.key !== null) {
    result += `pagination.key=${encodeURIComponent(pagination.key)}`;
    if (pagination.limit !== null) {
      result += `&pagination.limit=${pagination.limit}`;
    }
  } else {
    if (pagination.limit !== null) {
      result += `pagination.limit=${pagination.limit}`;
    }
  }

  return result;
};

export const convertPaginationToParamsOffset = (pagination) => {
  let result = '';
  if (!pagination || (!pagination.key && !pagination.limit)) {
    return '';
  }
  if (pagination.offset !== null) {
    result += `pagination.offset=${pagination.offset}`;
    if (pagination.limit !== null) {
      result += `&pagination.limit=${pagination.limit}`;
    }
  } else {
    if (pagination.limit !== null) {
      result += `pagination.limit=${pagination.limit}`;
    }
  }

  return result;
};

// removes the trailing slashes from given url
export const cleanURL = (url) => {
  if (url?.length) {
    return url.replace(/\/+$/, '');
  }
  return '';
};

export const getSelectedPartFromURL = (urlParts) => {
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
    default:
      return 'Overview';
  }
};
