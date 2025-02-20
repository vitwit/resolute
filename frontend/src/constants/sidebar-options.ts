export interface MenuItemI {
  name: string;
  icon: string;
  path: string;
  authzSupported: boolean;
  isMetaMaskSupported: boolean;
  multipleOptions: boolean;
}

export const SIDEBAR_MENU_OPTIONS: MenuItemI[] = [
  {
    name: 'Dashboard',
    icon: '/sidebar-menu-icons/dashboard-icon.svg',
    path: '/',
    authzSupported: true,
    isMetaMaskSupported: true,
    multipleOptions: false,
  },
  {
    name: 'Staking',
    icon: '/sidebar-menu-icons/staking-icon.svg',
    path: '/staking',
    authzSupported: true,
    isMetaMaskSupported: true,
    multipleOptions: false,
  },
  {
    name: 'Governance',
    icon: '/sidebar-menu-icons/gov-icon.svg',
    path: '/governance',
    authzSupported: true,
    isMetaMaskSupported: true,
    multipleOptions: false,
  },
  {
    name: 'Transfers',
    icon: '/sidebar-menu-icons/transfers-icon.svg',
    path: '/transfers',
    authzSupported: true,
    isMetaMaskSupported: true,
    multipleOptions: true,
  },
  {
    name: 'MultiSig',
    icon: '/sidebar-menu-icons/multisig-icon.svg',
    path: '/multisig',
    authzSupported: false,
    isMetaMaskSupported: false,
    multipleOptions: false,
  },
  {
    name: 'Transactions',
    icon: '/sidebar-menu-icons/txn-history-icon.svg',
    path: '/transactions/history',
    authzSupported: false,
    isMetaMaskSupported: true,
    multipleOptions: true,
  },
  {
    name: 'Cosmwasm',
    icon: '/sidebar-menu-icons/smart-contracts-icon.svg',
    path: '/cosmwasm',
    authzSupported: false,
    isMetaMaskSupported: false,
    multipleOptions: true,
  },
  {
    name: 'Settings',
    icon: '/sidebar-menu-icons/settings-icon.svg',
    path: '/settings',
    authzSupported: true,
    isMetaMaskSupported: false,
    multipleOptions: true,
  },
  {
    name: 'Valoren',
    icon: '/sidebar-menu-icons/valoren-icon.svg',
    path: '/valoren',
    authzSupported: false,
    isMetaMaskSupported: false,
    multipleOptions: false,
  },
];
