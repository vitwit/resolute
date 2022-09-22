import Axios from "axios";

const NODE_STATUS_URL = "/cosmos/base/tendermint/v1beta1/node_info";

const fetchNodeInfo = (baseURL) =>
   Axios.get(`${baseURL}${NODE_STATUS_URL}`, {
    headers: {
      Accept: "application/json, text/plain, */*",
    },
  });

const result = {
    fetchNodeInfo
};

export default result;
