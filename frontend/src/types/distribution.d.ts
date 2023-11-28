import { Pagination } from '../proposals';

interface DelegatorTotalRewardsRequest {
  baseURL: string;
  address: string;
  chainID: string;
  denom: string;
  pagination?: Pagination;
}

interface Reward {
  denom: string;
  amount: string;
}

interface DelegatorRewards {
  validator_address: string;
  reward: Reward[];
}

interface DefaultState {
  delegatorRewards: {
    list: DelegatorRewards[];
    totalRewards: number;
    status: string;
    errMsg: string;
    pagination: Pagination;
  };
  tx: {
    status: string;
    txHash: string;
  };
}

interface DistributionStoreInitialState {
  chains: {
    [key: string]: DefaultState;
  };
  defaultState: DefaultState;
}

interface ChainsMap {
  [key: string]: DefaultState;
}

interface DelegationsPairs {
  validator: string;
  delegator: string;
}

interface TxWithdrawAllRewardsInputs {
  msgs: DelegationsPairs[];
  denom: string;
  chainID: string;
  aminoConfig: AminoConfig;
  prefix: string;
  rest: string;
  feeAmount: number;
  feegranter: string;
  address: string;
  cosmosAddress:string
}
