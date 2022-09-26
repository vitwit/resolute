import Axios, { AxiosResponse } from "axios";
import { convertPaginationToParams } from "../utils";

const validatorsURL = "/cosmos/staking/v1beta1/validators";
const delegationsURL = "/cosmos/staking/v1beta1/delegations/";
const unbondingDelegationsURL = (address: string) =>
  `/cosmos/staking/v1beta1/delegators/${address}/unbonding_delegations`;
const paramsURL = "/cosmos/staking/v1beta1/params";

const fetchValidators = (
  baseURL: string,
  status: string,
  pagination: any
): Promise<AxiosResponse> => {
  let uri = `${baseURL}${validatorsURL}`;

  const pageParams = convertPaginationToParams(pagination);
  if (status !== null) {
    uri += `?status=${status}`;
    if (pageParams !== "") uri += `&${pageParams}`;
  } else {
    if (pageParams !== "") uri += `?${pageParams}`;
  }

  return Axios.get(uri);
};

const fetchdelegations = (
  baseURL: string,
  address: string,
  pagination: any
): Promise<AxiosResponse> => {
  let uri = `${baseURL}${delegationsURL}${address}`;
  const pageParams = convertPaginationToParams(pagination);
  if (pageParams !== "") uri += `?${pageParams}`;

  return Axios.get(uri);
};

const fetchUnbonding = (
  baseURL: string,
  address: string,
  pagination: any
): Promise<AxiosResponse> => {
  let uri = `${baseURL}${unbondingDelegationsURL(address)}`;
  const pageParams = convertPaginationToParams(pagination);
  if (pageParams !== "") uri += `?${pageParams}`;

  return Axios.get(uri);
};

const fetchParams = (baseURL: string): Promise<AxiosResponse> =>
  Axios.get(`${baseURL}${paramsURL}`);

const result = {
  validators: fetchValidators,
  delegations: fetchdelegations,
  unbonding: fetchUnbonding,
  params: fetchParams,
};

export default result;
