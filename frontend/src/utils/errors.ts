export const ERR_NO_OFFLINE_AMINO_SIGNER =
  'OfflineAmino signer is required to sign amino messages';
export const ERR_UNKNOWN = 'unknown error';
export const ERR_MISSING_TOKEN = (denom: string) =>
  `${denom} is not present in stored tokens. Please add the token!`;
export const CHAIN_NAME_EXIST_ERROR =
  'Chain already exist with the given chainName';
export const CHAIN_ID_EXIST_ERROR =
  'Chain already exist with the given chainId';
export const WALLET_REQUEST_ERROR = 'Wallet connection request rejected';
export const TXN_PENDING_ERROR = (type: string) =>
  `A ${type} transaction is already in pending`;
export const NO_DELEGATIONS_ERROR = 'No Delegations';
export const NO_REWARDS_ERROR = 'No Rewards';
export const FAILED_TO_BROADCAST_ERROR = 'Failed to broadcast transaction';
export const ADDRESS_NOT_FOUND =
  'Address not found on chain, please enter pubKey';
export const INVALID_PUBKEY = 'Invalid PubKey';
export const MIN_THRESHOLD_ERROR = 'Threshold must be a positive value';
export const MIN_PUBKEYS_ERROR = 'At least 1 pubkey is required';
export const DUPLICATE_PUBKEYS_ERROR = 'You have entered duplicate pubkeys';
export const MAX_THRESHOLD_ERROR =
  'Threshold can not be greater than members count';
export const MAX_PUBKEYS_ERROR = "You can't add more than 7 pub keys";
export const FAILED_TO_GENERATE_MULTISIG = 'Failed to create multisig account';
export const INSUFFICIENT_BALANCE = 'Insufficient balance';
export const NOT_MULTISIG_MEMBER_ERROR =
  'Cannot import account: You are not a member of the multisig account';
export const NOT_MULTISIG_ACCOUNT_ERROR = 'Not a multisig account';
export const CHAIN_NOT_SELECTED_ERROR = 'Please select at least one network from the left';
export const MSG_NOT_SELECTED_ERROR = 'Please select at least one transaction message from the left';
export const PERMISSION_NOT_SELECTED_ERROR =
  'Atleast one permission must be selected';
export const FAILED_TO_FETCH = 'Failed to fetch';
export const NETWORK_ERROR = 'Network error';
