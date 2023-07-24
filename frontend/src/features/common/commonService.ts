import { toBase64 } from "@cosmjs/encoding";
import Axios, { AxiosResponse } from "axios";

const BASE_URL = process.env.REACT_APP_API_URI;

const fetchPriceInfo = (denom: string): Promise<AxiosResponse> => {
  const uri = `${BASE_URL}/tokens-info/${denom}`;
  return Axios.get(uri);
};

const fetchAllTokensPriceInfo = (): Promise<AxiosResponse> => {
  const uri = `${BASE_URL}/tokens-info`;
  return Axios.get(uri);
};

const fetchICNSName = (data?: any) : Promise<AxiosResponse> => {
  const query = btoa(JSON.stringify({"icns_names": {"address": data.address}}))
  const uri = `https://lcd.osmosis.zone/cosmwasm/wasm/v1/contract/osmo1xk0s8xgktn9x5vwcgtjdxqzadg88fgn33p8u9cnpdxwemvxscvast52cdd/smart/${query}`;
  return Axios.get(uri);
};

const result = {
  tokenInfo: fetchPriceInfo,
  allTokensInfo : fetchAllTokensPriceInfo,
  fetchICNSName: fetchICNSName,
};

export default result;
