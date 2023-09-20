import Axios, { AxiosResponse } from "axios";
import { cleanURL, convertPaginationToParamsOffset } from "../utils";

const contractsURL = "/cosmwasm/wasm/v1/code";

const fetchCodes = (
  baseURL: string,
  pagination: any
): Promise<AxiosResponse> => {
  let uri = `${cleanURL(baseURL)}${contractsURL}`;
  const pageParams = convertPaginationToParamsOffset(pagination)
  if (pageParams !== "") uri += `?${pageParams}&pagination.count_total=true`


  return Axios.get(uri);
};

const result = {
  codes: fetchCodes,
};

export default result;
