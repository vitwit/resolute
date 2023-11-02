export const convertPaginationToParams = (pagination: {
  key: string | null | undefined;
  limit: number | null | undefined;
}): string => {
  let result = "";
  if (
    pagination === undefined ||
    (pagination?.key === null && pagination?.limit === null) ||
    (pagination?.key === undefined && pagination?.limit === undefined)
  ) {
    return "";
  }
  if (pagination.key) {
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

export const convertPaginationToParamsOffset = (pagination: {
  offset: number | null | undefined;
  limit: number | null | undefined;
}): string => {
  let result = "";
  if (
    pagination === undefined ||
    (pagination?.offset === null && pagination?.limit === null) ||
    (pagination?.offset === undefined && pagination?.limit === undefined)
  ) {
    return "";
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

export const cleanURL = (url: string | undefined): string => {
  if (url?.length) {
    return url.replace(/\/+$/, "");
  }
  return "";
};

export const getSelectedPartFromURL = (urlParts: string[]): string => {
  if (urlParts.length === 1) return "Overview";
  switch (urlParts[1]) {
    case "staking":
      return "Staking";
    case "feegrant":
      return "Feegrant";
    case "governance":
      return "Governance";
    case "groups":
      return "Groups";
    case "authz":
      return "Authz";
    case "multisig":
      return "Multisig";
    case "transfers":
      return "Transfers";
    default:
      return "Overview";
  }
};

