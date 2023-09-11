import Axios, { AxiosResponse } from "axios";
import { convertPaginationToParams, getValidURL } from "../utils";

const balancesURL = "/cosmos/bank/v1beta1/balances/";
const balanceURL = (address: string, denom: string) =>
  `/cosmos/bank/v1beta1/balances/${address}/by_denom?denom=${denom}`;

const fetchBalances = (
  baseURL: string,
  address: string,
  pagination: any
): Promise<AxiosResponse> => {
  let uri = `${getValidURL(baseURL)}${balancesURL}${address}`;
  const parsed = convertPaginationToParams(pagination);
  if (parsed === "") {
    uri += `?${parsed}`;
  }

  return Axios.get(uri);
};

const fetchBalance = (
  baseURL: string,
  address: string,
  denom: string
): Promise<AxiosResponse> => {
  const uri = `${getValidURL(baseURL)}${balanceURL(address, denom)}`;

  return Axios.get(uri);
};

const result = {
  balances: fetchBalances,
  balance: fetchBalance,
};

export default result;
