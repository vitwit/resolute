import Axios from "axios";

const accountInfoURL = "/cosmos/auth/v1beta1/accounts/";

const fetchAccountInfo = (baseURL, address) =>
  Axios.get(`${baseURL}${accountInfoURL}${address}`);

const result = {
  accountInfo: fetchAccountInfo,
};

export default result;
