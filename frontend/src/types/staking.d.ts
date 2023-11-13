import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';

interface GetValidatorsResponse {
  validators: Validator[];
  pagination: Pagination;
}

interface Validator {
  operator_address: string;
  consensus_pubkey: PubKey;
  jailed: boolean;
  status: string;
  tokens: string;
  delegator_shares: string;
  description: Description;
  unbonding_height: string;
  unbonding_time: string;
  commission: Commission;
  min_self_delegation: string;
  unbonding_on_hold_ref_count: string;
  unbonding_ids: string[];
  validator_bond_shares: string;
  liquid_shares: string;
}

interface Description {
  moniker: string;
  identity: string;
  website: string;
  security_contact: string;
  details: string;
}

interface Commission {
  commission_rates: CommissionRates;
  update_time: string;
}

interface CommissionRates {
  rate: string;
  max_rate: string;
  max_change_rate: string;
}

interface Pagination {
  next_key: string;
  total: string;
}

interface GetDelegationsResponse {
  delegation_responses: DelegationResponse[];
  pagination: Pagination;
}

interface DelegationResponse {
  delegation: Delegation;
  balance: Coin;
}

interface Delegation {
  delegator_address: string;
  validator_address: string;
  shares: string;
}

interface Balance {
  denom: string;
  amount: string;
}

interface GetParamsResponse {
  params: Params;
}

interface Params {
  unbonding_time: string;
  max_validators: number;
  max_entries: number;
  historical_entries: number;
  bond_denom: string;
  validator_bond_factor: string;
  global_liquid_staking_cap: string;
  validator_liquid_staking_cap: string;
}
