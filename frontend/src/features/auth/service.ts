import Axios, { AxiosResponse } from "axios";
import { getValidURL } from "../utils";

const accountInfoURL = "/cosmos/auth/v1beta1/accounts/";

const fetchAccountInfo = (
  baseURL: string,
  address: string
): Promise<AxiosResponse> => Axios.get(`${getValidURL(baseURL)}${accountInfoURL}${address}`);

const result = {
  accountInfo: fetchAccountInfo,
};

export default result;
