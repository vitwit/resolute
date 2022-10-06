import Axios, { AxiosResponse } from "axios";

const BASE_URL = process.env.REACT_APP_API_URI;

const fetchPriceInfo = (denom: string): Promise<AxiosResponse> => {
  const uri = `${BASE_URL}tokens-info/${denom}`;
  return Axios.get(uri);
};

const result = {
  tokenInfo: fetchPriceInfo,
};

export default result;
