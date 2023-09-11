import Axios, { AxiosResponse } from "axios";
import { convertPaginationToParams, getValidURL } from "../utils";

const grantToMeURL = "/cosmos/authz/v1beta1/grants/grantee/";
const grantByMeURL = "/cosmos/authz/v1beta1/grants/granter/";

const fetchGrantsToMe = (
  baseURL: string,
  grantee: string,
  pagination: any
): Promise<AxiosResponse> => {
  let uri = `${getValidURL(baseURL)}${grantToMeURL}${grantee}`;
  let parsed = convertPaginationToParams(pagination);
  if (parsed !== "") {
    uri += `?${parsed}`;
  }

  return Axios.get(uri);
};

const fetchGrantsByMe = (
  baseURL: string,
  grantee: string,
  pagination: any
): Promise<AxiosResponse> => {
  let uri = `${getValidURL(baseURL)}${grantByMeURL}${grantee}`;
  let parsed = convertPaginationToParams(pagination);
  if (parsed !== "") {
    uri += `?${parsed}`;
  }

  return Axios.get(uri);
};

const result = {
  grantsByMe: fetchGrantsByMe,
  grantsToMe: fetchGrantsToMe,
};

export default result;
