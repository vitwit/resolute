import Axios, { AxiosResponse } from "axios";

const fetchConsensusState = (rpcURL: string): Promise<AxiosResponse> => {
  let uri = `${rpcURL}abci_info`;
  return Axios.get(uri);
};

const result = {
  consensusState: fetchConsensusState,
};

export default result;
