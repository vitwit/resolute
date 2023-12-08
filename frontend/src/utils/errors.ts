export const ERR_NO_OFFLINE_AMINO_SIGNER =
  'OfflineAmino signer is required to sign amino messages';
export const ERR_UNKNOWN = 'unknown error';
export const ERR_MISSING_TOKEN = (denom: string) =>
  `${denom} is not present in stored tokens. Please add the token!`;
export const CHAIN_NAME_EXIST_ERROR =
  'Chain already exist with the given chainName';
export const CHAIN_ID_EXIST_ERROR =
  'Chain already exist with the given chainId';
export const WALLET_REQUEST_ERROR = "Wallet connection request rejected";
export const TXN_PENDING_ERROR = (type: string) =>
  `A ${type} transaction is already in pending`;
export const NO_DELEGATIONS_ERROR = 'No Delegations';
export const NO_REWARDS_ERROR = 'No Rewards';
