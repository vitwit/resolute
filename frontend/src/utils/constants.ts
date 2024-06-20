import { VoteOptionNumber } from '@/types/gov';

export const SUPPORTED_WALLETS = [
  {
    name: 'Keplr',
    logo: '/keplr-wallet-logo.png',
  },
  {
    name: 'Leap',
    logo: '/leap-wallet-logo.png',
  },
  {
    name: 'Cosmostation',
    logo: '/cosmostation-wallet-logo.png',
  },
  {
    name: 'MetaMask',
    logo: '/metamask.png',
  },
];

export const USD_CURRENCY = 'usd';
export const GAS_FEE = 860000;
export const ADD_NETWORK_TEMPLATE_URL =
  'https://raw.githubusercontent.com/vitwit/resolute/52aa50f4ba52cb65a2a483bedfbbca76fd39a47b/frontend/public/add-network-template.json';
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
export const MULTI_TRANSFER_MSG_COUNT = 3;
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
  '/cosmos.gov.v1beta1.MsgVote': 'Vote',
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

export const SIDENAV_MENU_ITEMS = {
  defaultOptions: [
    {
      name: 'Overview',
      icon: '/overview-icon.svg',
      activeIcon: '/overview-icon-active.svg',
      link: '/',
      authzSupported: true,
      isMetaMaskSupports: true,
    },
    {
      name: 'Transfers',
      icon: '/transfers-icon.svg',
      activeIcon: '/transfers-icon-active.svg',
      link: '/transfers',
      authzSupported: true,
      isMetaMaskSupports: true,
    },
    {
      name: 'Governance',
      icon: '/gov-icon.svg',
      activeIcon: '/gov-icon-active.svg',
      link: '/governance',
      authzSupported: true,
      isMetaMaskSupports: true,
    },
    {
      name: 'Staking',
      icon: '/staking-icon.svg',
      activeIcon: '/staking-icon-active.svg',
      link: '/staking',
      authzSupported: true,
      isMetaMaskSupports: true,
    },
    {
      name: 'Authz',
      icon: '/authz-icon.svg',
      activeIcon: '/authz-icon-active.svg',
      link: '/authz',
      authzSupported: false,
      isMetaMaskSupports: false,
    },
    {
      name: 'Multisig',
      icon: '/multisig-icon.svg',
      activeIcon: '/multisig-icon-active.svg',
      link: '/multisig',
      authzSupported: false,
      isMetaMaskSupports: false,
    },
    {
      name: 'Feegrant',
      icon: '/feegrant-icon.svg',
      activeIcon: '/feegrant-icon-active.svg',
      link: '/feegrant',
      authzSupported: false,
      isMetaMaskSupports: false,
    },
  ],
  moreOptions: [
    {
      name: 'Multiops',
      icon: '/multiops-icon.svg',
      activeIcon: '/multiops-icon-active.svg',
      link: '/multiops',
      authzSupported: false,
      isMetaMaskSupports: false,
    },
    {
      name: 'CosmWasm',
      icon: '/cosmwasm-icon.svg',
      activeIcon: '/cosmwasm-icon-active.svg',
      link: '/cosmwasm',
      authzSupported: false,
      isMetaMaskSupports: false,
    },
    {
      name: 'History',
      icon: '/history-icon.svg',
      activeIcon: '/history-icon.svg',
      link: '/history',
      authzSupported: true,
      isMetaMaskSupports: true,
    },
  ],
};
export const ALL_NETWORKS_ICON = '/icons/all-networks-icon.png';
export const CHANGE_NETWORK_ICON = '/switch-icon.svg';
export const TXN_SUCCESS_ICON = '/transaction-success-icon.svg';
export const TXN_FAILED_ICON = '/transaction-failed-icon.svg';
export const HELP_ICON = '/help-icon.svg';
export const REPORT_ICON = '/report-icon.svg';
export const GITHUB_ISSUES_PAGE_LINK =
  'https://github.com/vitwit/resolute/issues/new';
export const TELEGRAM_LINK = 'https://web.telegram.org/k/#-1982236507';
export const LOGOUT_ICON = '/logout-icon.svg';
export const TRANSFERS_CARDS_COUNT = 5;
export const NO_MESSAGES_ILLUSTRATION = '/no-messages-illustration.png';
export const NO_DELEGATIONS_MSG = `Looks like you haven't staked anything yet, go ahead and explore !`;
export const OVERVIEW_NO_DELEGATIONS =
  "Looks like you haven't staked anything yet, Select a network to delegate your tokens!";
export const VOTE_OPTIONS = ['Yes', 'Abstain', 'No', 'No With Veto'];
export const MAP_TXN_TYPES: Record<string, string[]> = {
  '/cosmos.staking.v1beta1.MsgDelegate': ['delegated', 'delegating'],
  '/cosmos.bank.v1beta1.MsgSend': ['sent', 'sending'],
  '/cosmos.staking.v1beta1.MsgBeginRedelegate': ['redelegated', 'redelegating'],
  '/cosmos.staking.v1beta1.MsgUndelegate': ['undelegated', 'undelegating'],
  '/cosmos.gov.v1beta1.MsgVote': ['voted', 'voting'],
  '/ibc.applications.transfer.v1.MsgTransfer': ['sent', 'sending'],
  '/cosmos.gov.v1beta1.MsgDeposit': ['deposited', 'depositing'],
};
export const TWITTER_ICON = '/twitter-icon.png';
export const TWITTER_LINK = 'https://twitter.com/vitwit_';
export const MIN_SALT_VALUE = 99999;
export const MAX_SALT_VALUE = 99999999;
export const NO_GRANTS_BY_ME_TEXT = "You haven't granted any permission yet";
export const NO_GRANTS_TO_ME_TEXT = "You don't have any grants";
export const SECP256K1_PUBKEY_TYPE = '/cosmos.crypto.secp256k1.PubKey';
export const MULTISIG_LEGACY_AMINO_PUBKEY_TYPE =
  '/cosmos.crypto.multisig.LegacyAminoPubKey';
export const GENERIC_AUTHORIZATION_TYPE =
  '/cosmos.authz.v1beta1.GenericAuthorization';
export const STAKE_AUTHORIZATION_TYPE =
  '/cosmos.staking.v1beta1.StakeAuthorization';
export const SEND_AUTHORIZATION_TYPE = '/cosmos.bank.v1beta1.SendAuthorization';
export const MULTISIG_PUBKEY_OBJECT = {
  name: 'pubKey',
  value: '',
  label: 'Public Key (Secp256k1)',
  placeHolder: 'E. g. AtgCrYjD+21d1+og3inzVEOGbCf5uhXnVeltFIo7RcRp',
  required: true,
  disabled: false,
  isPubKey: false,
  address: '',
  pubKey: '',
  error: '',
};
export const AXIOS_RETRIES_COUNT = 2;
export const MAX_TRY_END_POINTS = 1;
export const NO_FEEGRANTS_BY_ME_TEXT = "You haven't granted any allowance yet";
export const NO_FEEGRANTS_TO_ME_TEXT = "You don't have any feegrants";
export const SQUID_ID = process.env.NEXT_PUBLIC_SQUID_ID || '';
export const SQUID_CLIENT_API = 'https://api.0xsquid.com';
export const SQUID_CHAINS_API = 'https://v2.api.squidrouter.com/v2/chains';
export const ALERT_TYPE_MAP: Record<string, string> = {
  success: 'success',
  error: 'error',
  info: 'info',
};
export const WITVAL = 'witval';
export const VITWIT = 'vitwit';
export const POLYGON_API = 'https://staking-api.polygon.technology/api/v2';

export const POLYGON_CONFIG = {
  baseURL: 'https://staking-api.polygon.technology/api/v2',
  decimals: 18,
  coinGeckoId: 'matic',
  logo: '/polygon-logo.svg',
  witval: {
    profile: 'https://staking.polygon.technology/validators/50',
  },
};

export const OASIS_CONFIG = {
  baseURL: 'https://oasisscan.com',
  decimals: 9,
  coinGeckoId: 'rose',
  logo: '/oasis-network-logo.png',
  witval: {
    profile:
      'https://www.oasisscan.com/validators/detail/oasis1qzc687uuywnel4eqtdn6x3t9hkdvf6sf2gtv4ye9',
    commission: 19,
    operatorAddress: 'oasis1qzc687uuywnel4eqtdn6x3t9hkdvf6sf2gtv4ye9',
  },
};

export const COIN_GECKO_IDS: Record<string, string> = {
  ubld: 'BLD',
  umars: 'Mars Protocol',
  ucmdx: 'cmdx',
};

export const MULTISEND_PLACEHOLDER = `Enter here\n\nExample:\ncosmos1hzq8fmhmd52fdhjprj2uj8ht3q0wxxc29th0l6, 35uatom\ncosmos1h0t3funxenm54ke2z9tfdtgrctex575ufpz3kw, 2506uatom`;

export const voteOptionNumber: VoteOptionNumber = {
  yes: 1,
  no: 3,
  abstain: 2,
  veto: 4,
};

export const voteOptions: Record<string, string> = {
  VOTE_OPTION_YES: 'yes',
  VOTE_OPTION_ABSTAIN: 'abstain',
  VOTE_OPTION_NO: 'no',
  VOTE_OPTION_NO_WITH_VETO: 'veto',
  VOTE_OPTION_UNSPECIFIED: '',
};

export const MULTIOPS_MSG_TYPES = {
  send: 'Send',
  delegate: 'Delegate',
  undelegate: 'Undelegate',
  redelegate: 'Redelegate',
  vote: 'Vote',
  deposit: 'Deposit',
};
export const MULTIOPS_NOTE = `Note: Please ensure to allocate additional gas if the
transaction involves multiple messages, and be sure to
select the appropriate fee option in the signing
wallet.`;
export const MULTIOPS_SAMPLE_FILES = {
  delegate:
    'https://raw.githubusercontent.com/vitwit/resolute/a6a02cc1b74ee34604e6df35cfce7a46c39980ea/frontend/src/example-files/delegate.csv',
  deposit:
    'https://raw.githubusercontent.com/vitwit/resolute/a6a02cc1b74ee34604e6df35cfce7a46c39980ea/frontend/src/example-files/deposit.csv',
  redelegate:
    'https://raw.githubusercontent.com/vitwit/resolute/a6a02cc1b74ee34604e6df35cfce7a46c39980ea/frontend/src/example-files/redelegate.csv',
  send: 'https://raw.githubusercontent.com/vitwit/resolute/a6a02cc1b74ee34604e6df35cfce7a46c39980ea/frontend/src/example-files/send.csv',
  undelegate:
    'https://raw.githubusercontent.com/vitwit/resolute/a6a02cc1b74ee34604e6df35cfce7a46c39980ea/frontend/src/example-files/undelegate.csv',
  vote: 'https://raw.githubusercontent.com/vitwit/resolute/a6a02cc1b74ee34604e6df35cfce7a46c39980ea/frontend/src/example-files/vote.csv',
};
export const SWAP_ROUTE_ERROR = 'Failed to fetch routes.';
export const DUMMY_WALLET_MNEMONIC =
  process.env.NEXT_PUBLIC_DUMMY_WALLET_MNEMONIC || '';
export const INCREASE = 'increase';
export const DECREASE = 'decrease';
