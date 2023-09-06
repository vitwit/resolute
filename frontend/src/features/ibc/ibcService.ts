import Axios, { AxiosResponse } from "axios";

const fetchConsensusState = (rpcURL: string): Promise<AxiosResponse> => {
  let uri = `${rpcURL}abci_info`;
  return Axios.get(uri);
};

const fetchIBCRevisionInfo = (rpcURL: string): Promise<AxiosResponse> => {
  let uri = `${rpcURL}ibc/core/client/v1/client_states`;
  return Axios.get(uri);
};

const result = {
  consensusState: fetchConsensusState,
  fetchIBCRevisionInfo: fetchIBCRevisionInfo,
};

export default result;
