export const GAS_FEE = 860000;
export const ADD_NETWORK_TEMPLATE_URL =
  'https://raw.githubusercontent.com/vitwit/resolute/b5d184c8da894b2fea0ed40e56a599a1d813c422/frontend/public/add-network-template.json';
export const PROPOSAL_STATUS_VOTING_PERIOD = 'PROPOSAL_STATUS_VOTING_PERIOD';
export const COSMOS_CHAIN_ID = 'cosmoshub-4';
export const OFFCHAIN_VERIFICATION_MESSAGE =
  'Resolute offchain verification.\n\nSign an offchain verification message to\nprove your ownership to access the multisig page.';
/**
 * The base URL for the Multisig API.
 * @constant
 */
export const API_URL = process.env.NEXT_PUBLIC_APP_API_URI;
export const VALIDATOR_LOGO_URL = (identity: string) =>
  `https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${identity}&fields=pictures`;
export const VALIDATORS_PER_PAGE = 7;
export const CLOSE_ICON_PATH = '/close-icon.svg';
export const STAKING_DIALOG_IMAGE_PATH = '/delegate-popup-image.png';
export const SEND_TYPE_URL = "/cosmos.bank.v1beta1.MsgSend";
export const DELEGATE_TYPE_URL = "/cosmos.staking.v1beta1.MsgDelegate";
export const UNDELEGATE_TYPE_URL = "/cosmos.staking.v1beta1.MsgUndelegate";
export const REDELEGATE_TYPE_URL = "/cosmos.staking.v1beta1.MsgBeginRedelegate";