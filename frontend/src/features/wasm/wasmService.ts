import Axios, { AxiosResponse } from "axios";
import { cleanURL, convertPaginationToParamsOffset } from "../utils";

const CODES_URL = "/cosmwasm/wasm/v1/code";
const contractsURL = (codeId: number) => `/cosmwasm/wasm/v1/code/${codeId}/contracts`;

const fetchCodes = (
  baseURL: string,
  pagination: any
): Promise<AxiosResponse> => {
  let uri = `${cleanURL(baseURL)}${CODES_URL}`;
  const pageParams = convertPaginationToParamsOffset(pagination);
  if (pageParams !== "") uri += `?${pageParams}&pagination.count_total=true`;
  return Axios.get(uri);
};

const fetchContracts = (
  baseURL: string,
  codeId: number,
  pagination: any
): Promise<AxiosResponse> => {
  let uri = `${cleanURL(baseURL)}${contractsURL(codeId)}`;
  const pageParams = convertPaginationToParamsOffset(pagination);
  if (pageParams !== "") uri += `?${pageParams}&pagination.count_total=true`;
  return Axios.get(uri);
};

const result = {
  codes: fetchCodes,
  contracts: fetchContracts,
};

export default result;
