import {
  PageRequest,
} from "cosmjs-types/cosmos/base/query/v1beta1/pagination";
import Long from "long";

export const convertPaginationToParams = (pagination?: PageRequest): string => {
  if (pagination === null || pagination === undefined) return "";

  let result = "";
  if (pagination.key !== null) {
    result += `pagination.key=${encodeURIComponent(pagination.key.toString())}`;
    if (pagination.limit.greaterThanOrEqual(Long.ONE)) {
      result += `&pagination.limit=${pagination.limit}`;
    }
  } else {
    if (pagination.limit.greaterThanOrEqual(Long.ONE)) {
      result += `pagination.limit=${pagination.limit}`;
    }
  }

  return result;
};
