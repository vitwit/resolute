import Axios, { AxiosResponse } from "axios";
import { cleanURL } from "../utils";

const BASE_URL = process.env.REACT_APP_API_URI;

const fetchPriceInfo = (denom: string): Promise<AxiosResponse> => {
  const uri = `${cleanURL(BASE_URL)}/tokens-info/${denom}`;
  return Axios.get(uri);
};

const fetchAllTokensPriceInfo = (): Promise<AxiosResponse> => {
  const uri = `${cleanURL(BASE_URL)}/tokens-info`;
  return Axios.get(uri);
};

const result = {
  tokenInfo: fetchPriceInfo,
  allTokensInfo : fetchAllTokensPriceInfo,
};

export default result;
