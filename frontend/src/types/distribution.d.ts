import { Pagination } from '../proposals';
import { TxStatus } from './enums';

interface DelegatorTotalRewardsRequest {
  baseURL: string;
  baseURLs: string[];
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
    status: TxStatus;
    txHash: string;
  };
  withdrawAddress: string;
  isTxAll: boolean;
}

interface DistributionStoreInitialState {
  chains: {
    [key: string]: DefaultState;
  };
  authzChains: {
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
  isAuthzMode: false;
  basicChainInfo: BasicChainInfo;
  msgs: DelegationsPairs[];
  denom: string;
  chainID: string;
  aminoConfig: AminoConfig;
  prefix: string;
  rest: string;
  feeAmount: number;
  feegranter: string;
  address: string;
  cosmosAddress: string;
  isTxAll?: boolean;
  rpc?: string;
}

interface TxWithDrawValidatorCommissionInputs {
  isAuthzMode: false;
  basicChainInfo: BasicChainInfo;
  msgs: Msg[];
  denom: string;
  chainID: string;
  aminoConfig: AminoConfig;
  prefix: string;
  rest: string;
  feeAmount: number;
  feegranter: string;
  address: string;
  cosmosAddress: string;
  isTxAll?: boolean;
  rpc?: string;
}

interface TxWithDrawValidatorCommissionAndRewardsInputs {
  isAuthzMode: false;
  basicChainInfo: BasicChainInfo;
  msgs: Msg[];
  denom: string;
  chainID: string;
  aminoConfig: AminoConfig;
  prefix: string;
  rest: string;
  feeAmount: number;
  feegranter: string;
  address: string;
  cosmosAddress: string;
  isTxAll?: boolean;
  rpc?: string;
}

interface TxSetWithdrawAddressInputs {
  isAuthzMode: false;
  basicChainInfo: BasicChainInfo;
  msgs: Msg[];
  denom: string;
  chainID: string;
  aminoConfig: AminoConfig;
  prefix: string;
  rest: string;
  feeAmount: number;
  feegranter: string;
  address: string;
  cosmosAddress: string;
  rpc?: string;
}
