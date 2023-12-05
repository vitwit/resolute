import Axios, { AxiosResponse } from "axios";
import { convertPaginationToParams, cleanURL } from "../utils";

const delegationsURL = (addr: string): string =>
  `/cosmos/staking/v1beta1/validators/${addr}/delegations`;

const fetchDelegations = (
  baseURL: string,
  validator: string,
  pagination: any
): Promise<AxiosResponse> => {
  let uri = `${cleanURL(baseURL)}${delegationsURL(validator)}`;

  const pageParams = convertPaginationToParams(pagination);
  if (pageParams !== "") uri += `?${pageParams}`;
  return Axios.get(uri);
};

const result = {
  delegations: fetchDelegations,
};

export default result;
