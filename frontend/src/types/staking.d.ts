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

interface Validators {
  status: TxStatus;
  active: Record<string, Validator>;
  inactive: Record<string, Validator>;
  activeSorted: string[];
  inactiveSorted: string[];
  errMsg: string;
  pagination: {
    next_key: string | null;
  };
  totalActive: number;
  totalInactive: number;
  witvalValidator?: Validator;
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

interface GetUnbondingResponse {
  unbonding_responses: UnbondingResponse[];
  pagination: Pagination;
}

interface UnbondingEntry {
  creation_height: string;
  completion_time: string;
  initial_balance: string;
  balance: string;
  unbonding_id: string;
  unbonding_on_hold_ref_count: string;
}

interface UnbondingResponse {
  delegator_address: string;
  validator_address: string;
  entries: UnbondingEntry[];
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

interface TxRedelegateInputs {
  basicChainInfo: BasicChainInfo;
  delegator: string;
  srcVal: string;
  destVal: string;
  amount: number;
  denom: string;
  feeAmount: number;
  feegranter: string;
}

interface TxUndelegateInputs {
  basicChainInfo: BasicChainInfo;
  delegator: string;
  validator: string;
  amount: number;
  denom: string;
  feeAmount: number;
  feegranter: string;
}

interface TxDelegateInputs {
  basicChainInfo: BasicChainInfo;
  delegator: string;
  validator: string;
  amount: number;
  denom: string;
  feeAmount: number;
  feegranter: string;
}

interface TxReStakeInputs {
  basicChainInfo: BasicChainInfo;
  msgs: Msg[];
  memo: string;
  feeAmount: number;
  denom: string;
  feegranter: string;
}

interface TxCancelUnbondingInputs {
  basicChainInfo: BasicChainInfo;
  delegator: string;
  validator: string;
  amount: number;
  denom: string;
  creationHeight: string;
  feeAmount: number;
  feegranter: string;
}

type StakingMenuAction = (type: string, validator: Validator) => void;

interface ChainDelegationsProps {
  chainID: string;
  chainName: string;
  delegations: GetDelegationsResponse;
  validators: Validators;
  currency: Currency;
  rewards: DelegatorRewards[];
  validatorAddress: string;
  action: string;
  chainSpecific: boolean;
}

interface ChainUnbondingsProps {
  chainID: string;
  chainName: string;
  unbondings: GetUnbondingResponse;
  validators: Validators;
  currency: Currency;
}

interface DelegateTxInputs {
  validator: string;
  amount: number;
}

interface UndelegateTxInputs {
  validator: string;
  amount: number;
}

interface RedelegateTxInputs {
  src: string;
  amount: number;
  dest: string;
}

interface StakingCardProps {
  validator: string;
  identity: string;
  chainName: string;
  commission: number;
  delegated: number;
  networkLogo: string;
  coinDenom: string;
  rewards: number;
  onMenuAction: StakingMenuAction;
  validatorInfo: Validator;
  chainID: string;
}

interface DialogDelegateProps {
  open: boolean;
  onClose: () => void;
  validator: Validator | undefined;
  stakingParams: Params | undefined;
  availableBalance: number;
  loading: TxStatus;
  displayDenom: string;
  onDelegate: (data: { validator: string; amount: number }) => void;
}

interface DialogUndelegateProps {
  open: boolean;
  onClose: () => void;
  validator: Validator | undefined;
  stakingParams: Params | undefined;
  onUndelegate: (data: { validator: string; amount: number }) => void;
  loading: TxStatus;
  delegations: DelegationResponse[];
  currency: Currency;
}

interface DialogRedelegateProps {
  open: boolean;
  onClose: () => void;
  validator: Validator | undefined;
  stakingParams: Params | undefined;
  loading: TxStatus;
  active: ValidatorSet;
  inactive: ValidatorSet;
  delegations: DelegationResponse[];
  onRedelegate: (data: { src: string; amount: number; dest: string }) => void;
  currency: Currency;
}

interface ValidatorLogoProps {
  identity: string;
  width: number;
  height: number;
}

interface StakingSidebarProps {
  validators: Validators;
  currency: Currency;
  chainID: string;
  onMenuAction: StakingMenuAction;
  allValidatorsDialogOpen: boolean;
  toggleValidatorsDialog: () => void;
}

interface ValidatorItemProps {
  moniker: string;
  identity: string;
  commission: number;
  tokens: number;
  currency: Currency;
  onMenuAction: StakingMenuAction;
  validators: Validators;
  validator: string;
}

interface UnbondingCardProps {
  moniker: string;
  identity: string;
  chainName: string;
  amount: number;
  networkLogo: string;
  currency: Currency;
  completionTime: string;
  chainID: string;
  validatorAddress: string;
  creationHeight: string;
}

interface UnbondingCardStatsItemProps {
  name: string;
  value: string;
}

interface UnbondingCardStatsProps {
  completionTime: string;
  amount: number;
  coinDenom: string;
}

interface StakingCardHeaderProps {
  validator: string;
  identity: string;
  network: string;
  networkLogo: string;
}

interface StakingCardStatsProps {
  delegated: number;
  rewards: number;
  commission: number;
  coinDenom: string;
}

interface StakingCardsStatsItemProps {
  name: string;
  value: string;
}

type ToggleMenu = () => void;

interface StakingCardActionsProps {
  toggleMenu: ToggleMenu;
  menuRef: React.RefObject<HTMLDivElement>;
  chainID: string;
  validatorAddress: string;
  handleMenuAction: (type: string) => void;
}

interface StakingCardActionButtonProps {
  name: string;
  action: () => void;
  txStatus: string;
}

interface AllValidatorsProps {
  validators: Validators;
  currency: Currency;
  onMenuAction: StakingMenuAction;
  validatorsStatus: TxStatus;
  allValidatorsDialogOpen: boolean;
  toggleValidatorsDialog: () => void;
}
