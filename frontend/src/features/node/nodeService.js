import Axios from "axios";
import { getValidURL } from "../utils";

const NODE_STATUS_URL = "/cosmos/base/tendermint/v1beta1/node_info";

const fetchNodeInfo = (baseURL) =>
   Axios.get(`${getValidURL(baseURL)}${NODE_STATUS_URL}`, {
    headers: {
      Accept: "application/json, text/plain, */*",
    },
  });

const result = {
    fetchNodeInfo
};

export default result;
