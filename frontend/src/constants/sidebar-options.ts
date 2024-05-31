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
    // {
    //   name: 'Smart Contracts',
    //   icon: '/sidebar-menu-icons/smart-contracts-icon.svg',
    //   path: 'cosmwasm',
    //   authzSupported: false,
    //   isMetaMaskSupported: false,
    //   multipleOptions: false,
    // },
    // {
    //   name: 'MultiOps',
    //   icon: '/sidebar-menu-icons/txn-builder-icon.svg',
    //   path: '/transaction-builder',
    //   authzSupported: false,
    //   isMetaMaskSupported: false,
    //   multipleOptions: false,
    // },
    // {
    //   name: 'History',
    //   icon: '/sidebar-menu-icons/txn-history-icon.svg',
    //   path: '/history',
    //   authzSupported: true,
    //   isMetaMaskSupported: true,
    //   multipleOptions: false,
    // },
    // {
    //   name: 'Settings',
    //   icon: '/sidebar-menu-icons/settings-icon.svg',
    //   path: '/settings',
    //   authzSupported: false,
    //   isMetaMaskSupported: false,
    //   multipleOptions: true,
    // },
  ];
  
