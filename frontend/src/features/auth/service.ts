import Axios, { AxiosResponse } from "axios";

const accountInfoURL = "/cosmos/auth/v1beta1/accounts/";

const fetchAccountInfo = (
  baseURL: string,
  address: string
): Promise<AxiosResponse> => Axios.get(`${baseURL}${accountInfoURL}${address}`);

const result = {
  accountInfo: fetchAccountInfo,
};

export default result;
