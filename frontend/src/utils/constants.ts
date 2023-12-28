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
export const API_URL = process.env.NEXT_PUBLIC_APP_API_URI || '';
export const TRANSFERS_MSG_FILTERS = ['Send', 'IBC'];
export const SINGLE_TAB_TEXT = 'Single Transfer';
export const MULTI_TAB_TEXT = 'Multi Transfer';
export const SINGLE_BTN_TEXT = 'Send single';
export const MULTI_BTN_TEXT = 'Send multiple';
export const TRANSFERS_TAB1 = {
  current: SINGLE_TAB_TEXT,
  to: MULTI_BTN_TEXT,
};
export const TRANSFERS_TAB2 = {
  current: MULTI_TAB_TEXT,
  to: SINGLE_BTN_TEXT,
};
export const SEND_TX_FEE = 25000;
export const VALIDATOR_LOGO_URL = (identity: string) =>
  `https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${identity}&fields=pictures`;
export const VALIDATORS_PER_PAGE = 7;
export const CLOSE_ICON_PATH = '/close-icon.svg';
export const STAKING_DIALOG_IMAGE_PATH = '/delegate-popup-image.png';
export const SEND_TYPE_URL = '/cosmos.bank.v1beta1.MsgSend';
export const DELEGATE_TYPE_URL = '/cosmos.staking.v1beta1.MsgDelegate';
export const UNDELEGATE_TYPE_URL = '/cosmos.staking.v1beta1.MsgUndelegate';
export const REDELEGATE_TYPE_URL = '/cosmos.staking.v1beta1.MsgBeginRedelegate';
export const IBC_SEND_TYPE_URL = '/ibc.applications.transfer.v1.MsgTransfer';
export const DEPOSIT_TYPE_URL = '/cosmos.gov.v1beta1.MsgDeposit';
export const SEND_TEMPLATE = 'https://api.resolute.vitwit.com/_static/send.csv';
export const VOTE_TYPE_URL = '/cosmos.gov.v1beta1.MsgVote';
export const MULTI_TRANSFER_MSG_COUNT = 13;
export const DELETE_TXN_DIALOG_IMAGE_PATH = '/delete-txn-popup-image.png';
export const EMPTY_TXN = {
  id: NaN,
  multisig_address: '',
  fee: {
    amount: [
      {
        amount: '',
        denom: '',
      },
    ],
    gas: '',
    granter: '',
  },
  status: '',
  messages: [
    {
      typeUrl: '',
      value: {},
    },
  ],
  hash: '',
  err_msg: '',
  memo: '',
  signatures: [
    {
      signature: '',
      address: '',
    },
  ],
  last_updated: '',
  created_at: '',
};
export const MAP_TXNS = {
  '/cosmos.staking.v1beta1.MsgDelegate': 'Delegate',
  '/cosmos.bank.v1beta1.MsgSend': 'Send',
  '/cosmos.staking.v1beta1.MsgBeginRedelegate': 'ReDelegate',
  '/cosmos.staking.v1beta1.MsgUndelegate': 'UnDelegate',
  Msg: 'Tx Msg',
};
export const MULTISIG_TX_TYPES = {
  send: 'Send',
  delegate: 'Delegate',
  undelegate: 'Undelegate',
  redelegate: 'Redelegate',
};
export const ALERT_HIDE_DURATION = 3000;
export const MULTISIG_SEND_TEMPLATE =
  'https://api.resolute.vitwit.com/_static/send.csv';
export const MULTISIG_DELEGATE_TEMPLATE =
  'https://api.resolute.vitwit.com/_static/delegate.csv';
export const MULTISIG_UNDELEGATE_TEMPLATE =
  'https://api.resolute.vitwit.com/_static/undelegate.csv';
export const MULTISIG_REDELEGATE_TEMPLATE =
  'https://api.resolute.vitwit.com/_static/redelegate.csv';
export const txBroadcastTimeoutMs = 60_000;
export const txBroadcastPollIntervalMs = 3_000;
export const TRACK_IBC_TX_TIME_INTERVAL = 15000;
export const SIDENAV_MENU_ITEMS = [
  {
    name: 'Overview',
    icon: '/overview-icon.svg',
    activeIcon: '/overview-icon-active.svg',
    link: '/',
  },
  {
    name: 'Transfers',
    icon: '/transfers-icon.svg',
    activeIcon: '/transfers-icon-active.svg',
    link: '/transfers',
  },
  {
    name: 'Governance',
    icon: '/gov-icon.svg',
    activeIcon: '/gov-icon-active.svg',
    link: '/governance',
  },
  {
    name: 'Staking',
    icon: '/staking-icon.svg',
    activeIcon: '/staking-icon-active.svg',
    link: '/staking',
  },
  {
    name: 'Multisig',
    icon: '/multisig-icon.svg',
    activeIcon: '/multisig-icon-active.svg',
    link: '/multisig',
  },
];
export const ALL_NETWORKS_ICON = '/all-networks-icon.png';
export const CHANGE_NETWORK_ICON = '/switch-icon.svg';
export const TXN_SUCCESS_ICON = '/transaction-success-icon.svg';
export const TXN_FAILED_ICON = '/transaction-failed-icon.svg';
export const HELP_ICON = '/help-icon.svg';
export const REPORT_ICON = '/report-icon.svg';
export const GITHUB_ISSUES_PAGE_LINK =
  'https://github.com/vitwit/resolute/issues';
// TODO: Add telegram link
export const TELEGRAM_LINK = '';
export const LOGOUT_ICON = '/logout-icon.svg';
export const TRANSFERS_CARDS_COUNT = 5;
export const NO_MESSAGES_ILLUSTRATION = '/no-messages-illustration.png';
export const NO_DELEGATIONS_MSG = `Looks like you haven't staked anything yet, go ahead and explore !`;
export const VOTE_OPTIONS = ['Yes', 'Abstain', 'No', 'No With Veto'];
export const MAP_TXN_TYPES = {
  '/cosmos.staking.v1beta1.MsgDelegate': 'delegated',
  '/cosmos.bank.v1beta1.MsgSend': 'sent',
  '/cosmos.staking.v1beta1.MsgBeginRedelegate': 'redelegated',
  '/cosmos.staking.v1beta1.MsgUndelegate': 'undelegated',
  '/cosmos.gov.v1beta1.MsgVote': 'voted',
  '/ibc.applications.transfer.v1.MsgTransfer': 'sent',
  '/cosmos.gov.v1beta1.MsgDeposit': 'deposited',
};
