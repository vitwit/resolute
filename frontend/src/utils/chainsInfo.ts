import { COSMOSTATION, KEPLR, LEAP } from "@/constants/wallet";

export const networks: Network[] = [
  {
    enableModules: {
      authz: true,
      feegrant: true,
      group: false,
    },
    aminoConfig: {
      authz: false,
      feegrant: false,
      group: false,
    },
    showAirdrop: false,
    logos: {
      menu: 'https://raw.githubusercontent.com/vitwit/aneka-resources/d234799b2da3dc0b148829259866d07618b9773b/assets/agoric/bld.png',
      toolbar:
        'https://raw.githubusercontent.com/vitwit/chain-registry/master/agoric/images/bld.png',
    },
    isCustomNetwork: false,
    supportedWallets: [],
    keplrExperimental: false,
    leapExperimental: false,
    isTestnet: false,
    govV1: false,
    explorerTxHashEndpoint: 'https://atomscan.com/agoric/transactions/',
    config: {
      chainId: 'agoric-3',
      chainName: 'Agoric',
      rest: 'https://api.resolute.vitwit.com',
      rpc: 'https://api.resolute.vitwit.com',
      restURIs: [
        'https://api.resolute.vitwit.com'
      ],
      rpcURIs: [
        'https://agoric-rpc.polkachu.com',
        'https://rpc-agoric-ia.cosmosia.notional.ventures',
        'https://agoric-rpc.stakeandrelax.net',
      ],
      currencies: [
        {
          coinDenom: 'BLD',
          coinMinimalDenom: 'ubld',
          coinDecimals: 6,
        },
      ],
      bech32Config: {
        bech32PrefixAccAddr: 'agoric',
        bech32PrefixAccPub: 'agoricpub',
        bech32PrefixValAddr: 'agoricvaloper',
        bech32PrefixValPub: 'agoricvaloperpub',
        bech32PrefixConsAddr: 'agoricgvalcons',
        bech32PrefixConsPub: 'agoricvalconspub',
      },
      feeCurrencies: [
        {
          coinDenom: 'BLD',
          coinMinimalDenom: 'ubld',
          coinDecimals: 6,
          gasPriceStep: {
            low: 0.03,
            average: 0.05,
            high: 0.07,
          },
        },
        {
          coinDenom: 'IST',
          coinMinimalDenom: 'uist',
          coinDecimals: 6,
          gasPriceStep: {
            low: 0.0034,
            average: 0.007,
            high: 0.02,
          },
        },
      ],
      bip44: {
        coinType: 564,
      },
      stakeCurrency: {
        coinDenom: 'BLD',
        coinMinimalDenom: 'ubld',
        coinDecimals: 6,
      },
      image:
        'https://raw.githubusercontent.com/leapwallet/assets/2289486990e1eaf9395270fffd1c41ba344ef602/images/logo.svg',
      theme: {
        primaryColor: '#fff',
        gradient:
          'linear-gradient(180deg, #BF2A4560 0%, #12131C80 100%)',
      },
    },
  },
  {
    enableModules: {
      authz: true,
      feegrant: true,
      group: false,
    },
    aminoConfig: {
      authz: false,
      feegrant: false,
      group: false,
    },
    showAirdrop: false,
    logos: {
      menu: 'https://raw.githubusercontent.com/vitwit/aneka-resources/d234799b2da3dc0b148829259866d07618b9773b/assets/akash/akt.png',
      toolbar:
        'https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/akash/images/akash-logo.png',
    },
    keplrExperimental: false,
    leapExperimental: false,
    supportedWallets: [KEPLR, LEAP, COSMOSTATION],
    isTestnet: false,
    govV1: false,
    isCustomNetwork: false,
    explorerTxHashEndpoint: 'https://www.mintscan.io/akash/txs/',
    config: {
      chainId: 'akashnet-2',
      chainName: 'Akash',
      rest: 'https://api.resolute.vitwit.com',
      rpc: 'https://akash-rpc.lavenderfive.com:443',
      restURIs: ['https://api.resolute.vitwit.com'],
      rpcURIs: [
        'https://akash-rpc.lavenderfive.com:443',
        'https://akash-rpc.polkachu.com',
        'https://rpc-akash.cosmos-spaces.cloud',
        'https://api.resolute.vitwit.com/akash_rpc',
      ],
      currencies: [
        {
          coinDenom: 'AKT',
          coinMinimalDenom: 'uakt',
          coinDecimals: 6,
        },
      ],
      bech32Config: {
        bech32PrefixAccAddr: 'akash',
        bech32PrefixAccPub: 'akashpub',
        bech32PrefixValAddr: 'akashvaloper',
        bech32PrefixValPub: 'akashvaloperpub',
        bech32PrefixConsAddr: 'akashgvalcons',
        bech32PrefixConsPub: 'akashvalconspub',
      },
      bip44: {
        coinType: 118,
      },
      feeCurrencies: [
        {
          coinDenom: 'AKT',
          coinMinimalDenom: 'uakt',
          coinDecimals: 6,
          gasPriceStep: {
            low: 0.01,
            average: 0.025,
            high: 0.03,
          },
        },
      ],
      stakeCurrency: {
        coinDenom: 'AKT',
        coinMinimalDenom: 'uakt',
        coinDecimals: 6,
      },
      image:
        'https://raw.githubusercontent.com/leapwallet/assets/2289486990e1eaf9395270fffd1c41ba344ef602/images/logo.svg',
      theme: {
        primaryColor: '#F24E29',
        gradient: 'linear-gradient(180deg, #F24E2960 0%, #12131C80 100%)',
      },
    },
  },
  {
    enableModules: {
      authz: true,
      feegrant: true,
      group: false,
    },
    aminoConfig: {
      authz: false,
      feegrant: false,
      group: false,
    },
    showAirdrop: false,
    logos: {
      menu: 'https://raw.githubusercontent.com/vitwit/aneka-resources/d234799b2da3dc0b148829259866d07618b9773b/assets/cosmoshub/atom.png',
      toolbar:
        'https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/cosmoshub/images/cosmoshub-logo.png',
    },
    supportedWallets: [KEPLR, LEAP, COSMOSTATION],
    keplrExperimental: false,
    leapExperimental: false,
    isTestnet: false,
    govV1: true,
    isCustomNetwork: false,
    explorerTxHashEndpoint: 'https://www.mintscan.io/cosmos/txs/',
    config: {
      chainId: 'cosmoshub-4',
      chainName: 'CosmosHub',
      rest: 'https://api.resolute.vitwit.com',
      rpc: 'https://cosmos-rpc.polkachu.com',
      restURIs: ['https://api.resolute.vitwit.com'],
      rpcURIs: [
        'https://cosmos-rpc.polkachu.com',
        'https://rpc-cosmoshub.blockapsis.com',
        'https://cosmos-rpc.quickapi.com:443',
      ],
      currencies: [
        {
          coinDenom: 'ATOM',
          coinMinimalDenom: 'uatom',
          coinDecimals: 6,
        },
      ],
      bech32Config: {
        bech32PrefixAccAddr: 'cosmos',
        bech32PrefixAccPub: 'cosmospub',
        bech32PrefixValAddr: 'cosmosvaloper',
        bech32PrefixValPub: 'cosmosvaloperpub',
        bech32PrefixConsAddr: 'cosmosgvalcons',
        bech32PrefixConsPub: 'cosmosvalconspub',
      },
      feeCurrencies: [
        {
          coinDenom: 'ATOM',
          coinMinimalDenom: 'uatom',
          coinDecimals: 6,
          gasPriceStep: {
            low: 0.01,
            average: 0.025,
            high: 0.03,
          },
        },
      ],
      bip44: {
        coinType: 118,
      },
      stakeCurrency: {
        coinDenom: 'ATOM',
        coinMinimalDenom: 'uatom',
        coinDecimals: 6,
      },
      image:
        'https://raw.githubusercontent.com/leapwallet/assets/2289486990e1eaf9395270fffd1c41ba344ef602/images/logo.svg',
      theme: {
        primaryColor: '#272B40',
        gradient: 'linear-gradient(180deg, #272B4060 0%, #12131C80 100%)',
      },
    },
  },
  {
    enableModules: {
      authz: true,
      feegrant: true,
      group: false,
    },
    aminoConfig: {
      authz: false,
      feegrant: false,
      group: false,
    },
    showAirdrop: false,
    logos: {
      menu: 'https://raw.githubusercontent.com/vitwit/aneka-resources/d234799b2da3dc0b148829259866d07618b9773b/assets/desmos/dsm.png',
      toolbar:
        'https://raw.githubusercontent.com/vitwit/chain-registry/master/desmos/images/dsm.png',
    },
    keplrExperimental: true,
    leapExperimental: true,
    isTestnet: false,
    govV1: true,
    isCustomNetwork: false,
    supportedWallets: [],
    explorerTxHashEndpoint: 'https://www.mintscan.io/desmos/txs/',
    config: {
      chainId: 'desmos-mainnet',
      chainName: 'Desmos',
      rest: 'https://api.resolute.vitwit.com',
      rpc: 'https://api.resolute.vitwit.com',
      restURIs: [
        'https://api.resolute.vitwit.com'
      ],
      rpcURIs: [
        'https://rpc.mainnet.desmos.network',
        'https://desmos-rpc.lavenderfive.com',
        'https://api.resolute.vitwit.com/desmos_rpc',
      ],
      currencies: [
        {
          coinDenom: 'DSM',
          coinMinimalDenom: 'udsm',
          coinDecimals: 6,
        },
      ],
      bech32Config: {
        bech32PrefixAccAddr: 'desmos',
        bech32PrefixAccPub: 'desmospub',
        bech32PrefixValAddr: 'desmosvaloper',
        bech32PrefixValPub: 'desmosvaloperpub',
        bech32PrefixConsAddr: 'desmosgvalcons',
        bech32PrefixConsPub: 'desmosvalconspub',
      },
      feeCurrencies: [
        {
          coinDenom: 'DSM',
          coinMinimalDenom: 'udsm',
          coinDecimals: 6,
          gasPriceStep: {
            low: 0.01,
            average: 0.03,
            high: 0.05,
          },
        },
      ],
      bip44: {
        coinType: 118,
      },
      stakeCurrency: {
        coinDenom: 'DSM',
        coinMinimalDenom: 'udsm',
        coinDecimals: 6,
      },
      image:
        'https://raw.githubusercontent.com/leapwallet/assets/2289486990e1eaf9395270fffd1c41ba344ef602/images/logo.svg',
      theme: {
        primaryColor: '#fff',
        gradient:
          'linear-gradient(180deg, #F27D5260 0%, #12131C80 100%)',
      },
    },
  },
  {
    enableModules: {
      authz: true,
      feegrant: true,
      group: false,
    },
    aminoConfig: {
      authz: false,
      feegrant: false,
      group: false,
    },
    showAirdrop: false,
    logos: {
      menu: 'https://raw.githubusercontent.com/vitwit/aneka-resources/d234799b2da3dc0b148829259866d07618b9773b/assets/evmos/evmos.png',
      toolbar:
        'https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/evmos/images/evmos-logo.png',
    },
    keplrExperimental: false,
    leapExperimental: false,
    isTestnet: false,
    explorerTxHashEndpoint: 'https://www.mintscan.io/evmos/txs/',
    govV1: false,
    config: {
      chainId: 'evmos_9001-2',
      chainName: 'Evmos',
      rest: 'https://api.resolute.vitwit.com',
      rpc: 'https://api.resolute.vitwit.com',
      restURIs: ['https://api.resolute.vitwit.com'],
      rpcURIs: [
        'https://rpc-evmos-ia.cosmosia.notional.ventures:443',
        'https://evmos-rpc.polkachu.com',
        'https://evmos-rpc.publicnode.com:443',
      ],
      currencies: [
        {
          coinDenom: 'EVMOS',
          coinMinimalDenom: 'aevmos',
          coinDecimals: 18,
        },
      ],
      bech32Config: {
        bech32PrefixAccAddr: 'evmos',
        bech32PrefixAccPub: 'evmospub',
        bech32PrefixValAddr: 'evmosvaloper',
        bech32PrefixValPub: 'evmosvaloperpub',
        bech32PrefixConsAddr: 'evmosgvalcons',
        bech32PrefixConsPub: 'evmosvalconspub',
      },
      feeCurrencies: [
        {
          coinDenom: 'EVMOS',
          coinMinimalDenom: 'aevmos',
          coinDecimals: 18,
          gasPriceStep: {
            low: 0.01,
            average: 0.025,
            high: 0.03,
          },
        },
      ],
      bip44: {
        coinType: 60,
      },
      stakeCurrency: {
        coinDenom: 'EVMOS',
        coinMinimalDenom: 'aevmos',
        coinDecimals: 18,
      },
      image:
        'https://raw.githubusercontent.com/leapwallet/assets/2289486990e1eaf9395270fffd1c41ba344ef602/images/logo.svg',
      theme: {
        primaryColor: '#fff',
        gradient: 'linear-gradient(180deg, #F2453560 0%, #12131C80 100%)',
      },
    },
    isCustomNetwork: false,
    supportedWallets: []
  },
  {
    enableModules: {
      authz: true,
      feegrant: true,
      group: false,
    },
    aminoConfig: {
      authz: false,
      feegrant: false,
      group: false,
    },
    showAirdrop: false,
    logos: {
      menu: 'https://raw.githubusercontent.com/vitwit/aneka-resources/d234799b2da3dc0b148829259866d07618b9773b/assets/juno/juno.png',
      toolbar:
        'https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/juno/images/juno-logo.png',
    },
    keplrExperimental: false,
    leapExperimental: false,
    isTestnet: false,
    govV1: true,
    explorerTxHashEndpoint: 'https://www.mintscan.io/juno/txs/',
    config: {
      chainId: 'juno-1',
      chainName: 'Juno',
      rest: 'https://api.resolute.vitwit.com',
      rpc: 'https://api.resolute.vitwit.com',
      restURIs: ['https://api.resolute.vitwit.com'],
      rpcURIs: [
        'https://juno-rpc.lavenderfive.com:443',
        'https://juno-rpc.polkachu.com',
        'https://rpc-juno.ecostake.com',
        'https://api.resolute.vitwit.com/juno_rpc',
      ],
      currencies: [
        {
          coinDenom: 'JUNO',
          coinMinimalDenom: 'ujuno',
          coinDecimals: 6,
        },
      ],
      bech32Config: {
        bech32PrefixAccAddr: 'juno',
        bech32PrefixAccPub: 'junopub',
        bech32PrefixValAddr: 'junovaloper',
        bech32PrefixValPub: 'junovaloperpub',
        bech32PrefixConsAddr: 'junogvalcons',
        bech32PrefixConsPub: 'junovalconspub',
      },
      feeCurrencies: [
        {
          coinDenom: 'JUNO',
          coinMinimalDenom: 'ujuno',
          coinDecimals: 6,
          gasPriceStep: {
            low: 0.01,
            average: 0.025,
            high: 0.03,
          },
        },
      ],
      bip44: {
        coinType: 118,
      },
      stakeCurrency: {
        coinDenom: 'JUNO',
        coinMinimalDenom: 'ujuno',
        coinDecimals: 6,
      },
      image:
        'https://raw.githubusercontent.com/leapwallet/assets/2289486990e1eaf9395270fffd1c41ba344ef602/images/logo.svg',
      theme: {
        primaryColor: '#fff',
        gradient: 'linear-gradient(180deg, #F2798360 0%, #12131C80 100%)',
      },
    },
    isCustomNetwork: false,
    supportedWallets: [],
  },
  {
    enableModules: {
      authz: true,
      feegrant: true,
      group: false,
    },
    aminoConfig: {
      authz: false,
      feegrant: false,
      group: false,
    },
    showAirdrop: false,
    logos: {
      menu: 'https://raw.githubusercontent.com/vitwit/aneka-resources/d234799b2da3dc0b148829259866d07618b9773b/assets/omniflixhub/flix.png',
      toolbar:
        'https://raw.githubusercontent.com/vitwit/chain-registry/master/omniflixhub/images/flix.png',
    },
    keplrExperimental: false,
    leapExperimental: false,
    isTestnet: false,
    govV1: false,
    explorerTxHashEndpoint: 'https://www.mintscan.io/omniflix/txs/',
    config: {
      chainId: 'omniflixhub-1',
      chainName: 'OmniflixHub',
      rest: 'https://api.resolute.vitwit.com',
      rpc: 'https://api.resolute.vitwit.com',
      restURIs: [
        'https://api.resolute.vitwit.com'
      ],
      rpcURIs: [
        'https://rpc-omniflixhub-ia.cosmosia.notional.ventures',
        'https://omniflix-rpc.publicnode.com:443',
        'https://omniflixhub-rpc.lavenderfive.com',
        'https://api.resolute.vitwit.com/omniflix_rpc',
      ],
      currencies: [
        {
          coinDenom: 'FLIX',
          coinMinimalDenom: 'uflix',
          coinDecimals: 6,
        },
      ],
      bech32Config: {
        bech32PrefixAccAddr: 'omniflix',
        bech32PrefixAccPub: 'omniflixpub',
        bech32PrefixValAddr: 'omniflixvaloper',
        bech32PrefixValPub: 'omniflixvaloperpub',
        bech32PrefixConsAddr: 'omniflixgvalcons',
        bech32PrefixConsPub: 'omniflixvalconspub',
      },
      feeCurrencies: [
        {
          coinDenom: 'FLIX',
          coinMinimalDenom: 'uflix',
          coinDecimals: 6,
          gasPriceStep: {
            low: 0.01,
            average: 0.0025,
            high: 0.025,
          },
        },
      ],
      bip44: {
        coinType: 118,
      },
      stakeCurrency: {
        coinDenom: 'FLIX',
        coinMinimalDenom: 'uflix',
        coinDecimals: 6,
      },
      image:
        'https://raw.githubusercontent.com/leapwallet/assets/2289486990e1eaf9395270fffd1c41ba344ef602/images/logo.svg',
      theme: {
        primaryColor: '#fff',
        gradient:
          'linear-gradient(180deg, #D91E7560 0%, #12131C80 100%)',
      },
    },
    isCustomNetwork: false,
    supportedWallets: []
  },
  {
    enableModules: {
      authz: true,
      feegrant: false,
      group: false,
    },
    aminoConfig: {
      authz: false,
      feegrant: false,
      group: false,
    },
    showAirdrop: false,
    logos: {
      menu: 'https://raw.githubusercontent.com/vitwit/aneka-resources/d234799b2da3dc0b148829259866d07618b9773b/assets/osmosis/osmo.png',
      toolbar:
        'https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/osmosis/images/osmosis-logo.png',
    },
    supportedWallets: [KEPLR, LEAP, COSMOSTATION],
    keplrExperimental: false,
    leapExperimental: false,
    isTestnet: false,
    govV1: true,
    isCustomNetwork: false,
    explorerTxHashEndpoint: 'https://www.mintscan.io/osmosis/txs/',
    config: {
      chainId: 'osmosis-1',
      chainName: 'Osmosis',
      rest: 'https://api.resolute.vitwit.com',
      rpc: 'https://rpc.osmosis.zone',
      restURIs: ['https://api.resolute.vitwit.com'],
      rpcURIs: [
        'https://rpc.osmosis.zone',
        'https://rpc-osmosis.blockapsis.com',
        'https://osmosis-rpc.quickapi.com:443',
      ],
      currencies: [
        {
          coinDenom: 'OSMO',
          coinMinimalDenom: 'uosmo',
          coinDecimals: 6,
        },
      ],
      bech32Config: {
        bech32PrefixAccAddr: 'osmo',
        bech32PrefixAccPub: 'osmopub',
        bech32PrefixValAddr: 'osmovaloper',
        bech32PrefixValPub: 'osmovaloperpub',
        bech32PrefixConsAddr: 'osmogvalcons',
        bech32PrefixConsPub: 'osmovalconspub',
      },
      feeCurrencies: [
        {
          coinDenom: 'OSMO',
          coinMinimalDenom: 'uosmo',
          coinDecimals: 6,
          gasPriceStep: {
            low: 0.01,
            average: 0.025,
            high: 0.03,
          },
        },
      ],
      bip44: {
        coinType: 118,
      },
      stakeCurrency: {
        coinDenom: 'OSMO',
        coinMinimalDenom: 'uosmo',
        coinDecimals: 6,
      },
      image:
        'https://raw.githubusercontent.com/leapwallet/assets/2289486990e1eaf9395270fffd1c41ba344ef602/images/logo.svg',
      theme: {
        primaryColor: '#5A0DA6',
        gradient: 'linear-gradient(180deg, #5A0DA660 0%, #12131C80 100%)',
      },
    },
  },
  {
    enableModules: {
      authz: true,
      feegrant: true,
      group: false,
    },
    aminoConfig: {
      authz: false,
      feegrant: false,
      group: false,
    },
    showAirdrop: true,
    logos: {
      menu: 'https://raw.githubusercontent.com/vitwit/aneka-resources/d234799b2da3dc0b148829259866d07618b9773b/assets/passage/pasg.png',
      toolbar:
        'https://raw.githubusercontent.com/vitwit/chain-registry/aleem/staking-assets/passage3d/images/passage3d-logo.png',
    },
    keplrExperimental: true,
    leapExperimental: true,
    isTestnet: false,
    govV1: false,
    explorerTxHashEndpoint: 'https://mintscan.io/passage/txs/',
    config: {
      chainId: 'passage-2',
      chainName: 'Passage',
      rest: 'https://api.resolute.vitwit.com',
      rpc: 'https://api.resolute.vitwit.com',
      restURIs: [
        'https://api.resolute.vitwit.com'
      ],
      rpcURIs: [
        'https://rpc.passage.vitwit.com',
        'https://rpc-passage.ecostake.com',
        'https://passage-rpc.polkachu.com',
        'https://rpc-passage-ia.cosmosia.notional.ventures',
      ],
      bip44: {
        coinType: 118,
      },
      currencies: [
        {
          coinDenom: 'PASG',
          coinMinimalDenom: 'upasg',
          coinDecimals: 6,
          coinGeckoId: 'passage',
        },
      ],
      walletUrlForStaking: 'https://resolute.vitwit.com/passage/staking',
      bech32Config: {
        bech32PrefixAccAddr: 'pasg',
        bech32PrefixAccPub: 'pasgpub',
        bech32PrefixValAddr: 'pasgvaloper',
        bech32PrefixValPub: 'pasgvaloperpub',
        bech32PrefixConsAddr: 'pasgvalcons',
        bech32PrefixConsPub: 'pasgvalconspub',
      },
      feeCurrencies: [
        {
          coinDenom: 'PASG',
          coinMinimalDenom: 'upasg',
          coinDecimals: 6,
          coinGeckoId: 'passage',
          gasPriceStep: {
            low: 0,
            average: 0,
            high: 0.01,
          },
        },
      ],
      stakeCurrency: {
        coinDenom: 'PASG',
        coinMinimalDenom: 'upasg',
        coinDecimals: 6,
        coinGeckoId: 'passage',
      },
      image:
        'https://raw.githubusercontent.com/leapwallet/assets/2289486990e1eaf9395270fffd1c41ba344ef602/images/logo.svg',
      theme: {
        primaryColor: '#fff',
        gradient:
          'linear-gradient(180deg, #72727360 0%, #12131C80 100%)',
      },
    },
    isCustomNetwork: false,
    supportedWallets: []
  },
  {
    enableModules: {
      authz: true,
      feegrant: true,
      group: false,
    },
    aminoConfig: {
      authz: false,
      feegrant: false,
      group: false,
    },
    showAirdrop: false,
    logos: {
      menu: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/dydx/images/dydx.svg',
      toolbar:
        'https://raw.githubusercontent.com/cosmos/chain-registry/master/dydx/images/dydx.svg',
    },
    supportedWallets: [KEPLR, LEAP, COSMOSTATION],
    keplrExperimental: false,
    leapExperimental: true,
    isTestnet: false,
    govV1: true,
    isCustomNetwork: false,
    explorerTxHashEndpoint: 'https://mintscan.io/dydx/txs/',
    config: {
      chainId: 'dydx-mainnet-1',
      chainName: 'DYDX',
      rest: 'https://api.resolute.vitwit.com',
      rpc: 'https://dydx-rpc.publicnode.com:443',
      restURIs: ['https://api.resolute.vitwit.com'],
      rpcURIs: [
        'https://dydx-rpc.publicnode.com:443',
        'https://dydx-dao-rpc.polkachu.com',
        'https://dydx-rpc.lavenderfive.com:443',
      ],
      currencies: [
        {
          coinDenom: 'DYDX',
          coinMinimalDenom: 'adydx',
          coinDecimals: 18,
        },
      ],
      bip44: {
        coinType: 118,
      },
      bech32Config: {
        bech32PrefixAccAddr: 'dydx',
        bech32PrefixAccPub: 'dydxpub',
        bech32PrefixValAddr: 'dydxvaloper',
        bech32PrefixValPub: 'dydxvaloperpub',
        bech32PrefixConsAddr: 'dydxvalcons',
        bech32PrefixConsPub: 'dydxvalconspub',
      },
      walletUrlForStaking: 'https://resolute.vitwit.com/dydx/staking',
      feeCurrencies: [
        {
          coinDenom: 'DYDX',
          coinMinimalDenom: 'adydx',
          coinDecimals: 18,
          coinGeckoId: 'dydx',
          gasPriceStep: {
            low: 0.01,
            average: 0.02,
            high: 0.05,
          },
        },
      ],
      stakeCurrency: {
        coinDenom: 'DYDX',
        coinMinimalDenom: 'adydx',
        coinDecimals: 18,
        coinGeckoId: 'dydx',
      },
      image:
        'https://raw.githubusercontent.com/leapwallet/assets/2289486990e1eaf9395270fffd1c41ba344ef602/images/logo.svg',
      theme: {
        primaryColor: '#4F4DB5',
        gradient: 'linear-gradient(180deg, #4F4DB560 0%, #12131C80 100%)',
      },
    },
  },
  {
    enableModules: {
      authz: true,
      feegrant: true,
      group: false,
    },
    aminoConfig: {
      authz: false,
      feegrant: false,
      group: false,
    },
    showAirdrop: false,
    logos: {
      menu: 'https://raw.githubusercontent.com/vitwit/aneka-resources/d234799b2da3dc0b148829259866d07618b9773b/assets/quicksilver/qck.png',
      toolbar:
        'https://raw.githubusercontent.com/vitwit/chain-registry/master/quicksilver/images/quicksilver-chain-logo.png',
    },
    keplrExperimental: false,
    leapExperimental: false,
    isTestnet: false,
    govV1: true,
    explorerTxHashEndpoint: 'https://www.mintscan.io/quicksilver/txs/',
    config: {
      chainId: 'quicksilver-2',
      chainName: 'Quicksilver',
      rest: 'https://api.resolute.vitwit.com',
      rpc: 'https://api.resolute.vitwit.com',
      restURIs: [
        'https://api.resolute.vitwit.com'
      ],
      rpcURIs: [
        'https://quicksilver-rpc.staketab.org:443',
        'https://rpc.quicksilver.zone:443',
        'https://quicksilver-rpc.lavenderfive.com:443',
        'https://api.resolute.vitwit.com/quicksilver_rpc',
      ],
      currencies: [
        {
          coinDenom: 'QCK',
          coinMinimalDenom: 'uqck',
          coinDecimals: 6,
        },
      ],
      bech32Config: {
        bech32PrefixAccAddr: 'quick',
        bech32PrefixAccPub: 'quickpub',
        bech32PrefixValAddr: 'quickvaloper',
        bech32PrefixValPub: 'quickvaloperpub',
        bech32PrefixConsAddr: 'quickgvalcons',
        bech32PrefixConsPub: 'quickvalconspub',
      },
      bip44: {
        coinType: 118,
      },
      feeCurrencies: [
        {
          coinDenom: 'QCK',
          coinMinimalDenom: 'uqck',
          coinDecimals: 6,
          gasPriceStep: {
            low: 0.0001,
            average: 0.0001,
            high: 0.00025,
          },
        },
      ],
      stakeCurrency: {
        coinDenom: 'QCK',
        coinMinimalDenom: 'uqck',
        coinDecimals: 6,
      },
      image:
        'https://raw.githubusercontent.com/leapwallet/assets/2289486990e1eaf9395270fffd1c41ba344ef602/images/logo.svg',
      theme: {
        primaryColor: '#fff',
        gradient:
          'linear-gradient(180deg, #BFBFBF60 0%, #12131C80 100%)',
      },
    },
    isCustomNetwork: false,
    supportedWallets: []
  },
  {
    enableModules: {
      authz: true,
      feegrant: true,
      group: true,
    },
    aminoConfig: {
      authz: true,
      feegrant: true,
      group: false,
    },
    showAirdrop: false,
    logos: {
      menu: 'https://raw.githubusercontent.com/vitwit/aneka-resources/d234799b2da3dc0b148829259866d07618b9773b/assets/regen/regen.png',
      toolbar:
        'https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/regen/images/regen-logo.png',
    },
    keplrExperimental: false,
    leapExperimental: true,
    isTestnet: false,
    explorerTxHashEndpoint: 'https://www.mintscan.io/regen/txs/',
    govV1: true,
    config: {
      chainId: 'regen-1',
      chainName: 'Regen',
      rest: 'https://api.resolute.vitwit.com',
      rpc: 'https://api.resolute.vitwit.com',
      restURIs: [
        'https://api.resolute.vitwit.com'
      ],
      rpcURIs: [
        'https://regen-mainnet-rpc.autostake.com:443',
        'https://rpc-regen-ia.cosmosia.notional.ventures',
        'https://regen-rpc.publicnode.com:443',
        'https://api.resolute.vitwit.com/regen_rpc',
      ],
      currencies: [
        {
          coinDenom: 'REGEN',
          coinMinimalDenom: 'uregen',
          coinDecimals: 6,
        },
      ],
      bech32Config: {
        bech32PrefixAccAddr: 'regen',
        bech32PrefixAccPub: 'regenpub',
        bech32PrefixValAddr: 'regenvaloper',
        bech32PrefixValPub: 'regenvaloperpub',
        bech32PrefixConsAddr: 'regengvalcons',
        bech32PrefixConsPub: 'regenvalconspub',
      },
      feeCurrencies: [
        {
          coinDenom: 'REGEN',
          coinMinimalDenom: 'uregen',
          coinDecimals: 6,
          gasPriceStep: {
            low: 0.01,
            average: 0.025,
            high: 0.03,
          },
        },
      ],
      bip44: {
        coinType: 118,
      },
      stakeCurrency: {
        coinDenom: 'REGEN',
        coinMinimalDenom: 'uregen',
        coinDecimals: 6,
      },
      image:
        'https://raw.githubusercontent.com/leapwallet/assets/2289486990e1eaf9395270fffd1c41ba344ef602/images/logo.svg',
      theme: {
        primaryColor: '#fff',
        gradient:
          'linear-gradient(180deg, #5ABF9060 0%, #12131C80 100%)',
      },
    },
    isCustomNetwork: false,
    supportedWallets: []
  },
  {
    enableModules: {
      authz: true,
      feegrant: true,
      group: false,
    },
    aminoConfig: {
      authz: false,
      feegrant: false,
      group: false,
    },
    showAirdrop: false,
    logos: {
      menu: 'https://raw.githubusercontent.com/vitwit/aneka-resources/d234799b2da3dc0b148829259866d07618b9773b/assets/stargaze/stars.png',
      toolbar:
        'https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/stargaze/images/stargaze-logo.png',
    },
    keplrExperimental: false,
    leapExperimental: false,
    isTestnet: false,
    govV1: false,
    explorerTxHashEndpoint: 'https://www.mintscan.io/stargaze/txs/',
    config: {
      chainId: 'stargaze-1',
      chainName: 'Stargaze',
      rest: 'https://api.resolute.vitwit.com',
      rpc: 'https://api.resolute.vitwit.com',
      restURIs: [
        'https://api.resolute.vitwit.com'
      ],
      rpcURIs: [
        'https://stargaze-rpc.polkachu.com',
        'https://stargaze-rpc.publicnode.com:443',
        'https://rpc-stargaze-ia.cosmosia.notional.ventures',
      ],
      currencies: [
        {
          coinDenom: 'STARS',
          coinMinimalDenom: 'ustars',
          coinDecimals: 6,
        },
      ],
      bech32Config: {
        bech32PrefixAccAddr: 'stars',
        bech32PrefixAccPub: 'starspub',
        bech32PrefixValAddr: 'starsvaloper',
        bech32PrefixValPub: 'starsvaloperpub',
        bech32PrefixConsAddr: 'starsgvalcons',
        bech32PrefixConsPub: 'starsvalconspub',
      },
      feeCurrencies: [
        {
          coinDenom: 'STARS',
          coinMinimalDenom: 'ustars',
          coinDecimals: 6,
          gasPriceStep: {
            low: 1,
            average: 1.1,
            high: 1.2,
          },
        },
      ],
      bip44: {
        coinType: 118,
      },
      stakeCurrency: {
        coinDenom: 'STARS',
        coinMinimalDenom: 'ustars',
        coinDecimals: 6,
      },
      image:
        'https://raw.githubusercontent.com/leapwallet/assets/2289486990e1eaf9395270fffd1c41ba344ef602/images/logo.svg',
      theme: {
        primaryColor: '#fff',
        gradient:
          'linear-gradient(180deg, #9AD9CD60 0%, #12131C80 100%)',
      },
    },
    isCustomNetwork: false,
    supportedWallets: []
  },
  {
    enableModules: {
      authz: false,
      feegrant: false,
      group: false,
    },
    aminoConfig: {
      authz: false,
      feegrant: false,
      group: false,
    },
    showAirdrop: false,
    logos: {
      menu: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/dymension/images/dymension-logo.svg',
      toolbar:
        'https://raw.githubusercontent.com/cosmos/chain-registry/master/dymension/images/dymension-logo.svg',
    },
    keplrExperimental: false,
    leapExperimental: true,
    isTestnet: false,
    govV1: true,
    explorerTxHashEndpoint: 'https://explorer.nodestake.org/dymension/tx/',
    config: {
      chainId: 'dymension_1100-1',
      chainName: 'Dymension',
      rest: 'https://api.resolute.vitwit.com',
      rpc: 'https://api.resolute.vitwit.com',
      restURIs: [
        'https://api.resolute.vitwit.com'
      ],
      rpcURIs: [
        'https://rpc.dymension.nodestake.org',
        'https://dymension-mainnet-rpc.autostake.com:443',
        'https://dymension-rpc.lavenderfive.com:443',
      ],
      currencies: [
        {
          coinDenom: 'DYM',
          coinMinimalDenom: 'adym',
          coinDecimals: 18,
        },
      ],
      bip44: {
        coinType: 118,
      },
      bech32Config: {
        bech32PrefixAccAddr: 'dym',
        bech32PrefixAccPub: 'dympub',
        bech32PrefixValAddr: 'dymvaloper',
        bech32PrefixValPub: 'dymvaloperpub',
        bech32PrefixConsAddr: 'dymvalcons',
        bech32PrefixConsPub: 'dymvalconspub',
      },
      walletUrlForStaking: 'https://resolute.vitwit.com/dymension/staking',
      feeCurrencies: [
        {
          coinDenom: 'DYM',
          coinMinimalDenom: 'adym',
          coinDecimals: 18,
          coinGeckoId: 'dym',
          gasPriceStep: {
            low: 0.02,
            average: 0.02,
            high: 0.02,
          },
        },
      ],
      stakeCurrency: {
        coinDenom: 'DYM',
        coinMinimalDenom: 'adym',
        coinDecimals: 18,
        coinGeckoId: 'dym',
      },
      image:
        'https://raw.githubusercontent.com/cosmos/chain-registry/master/dymension/images/dymension-logo.svg',
      theme: {
        primaryColor: '#fff',
        gradient:
          'linear-gradient(180deg, #e9c3a460 0%, #12131C80 100%)',
      },
    },
    isCustomNetwork: false,
    supportedWallets: []
  },
  {
    enableModules: {
      authz: true,
      feegrant: true,
      group: true,
    },
    aminoConfig: {
      authz: true,
      feegrant: true,
      group: false,
    },
    showAirdrop: false,
    logos: {
      menu: 'https://raw.githubusercontent.com/vitwit/aneka-resources/d234799b2da3dc0b148829259866d07618b9773b/assets/umee/umee.png',
      toolbar:
        'https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/umee/images/umee-logo.png',
    },
    keplrExperimental: false,
    leapExperimental: false,
    isTestnet: false,
    explorerTxHashEndpoint: 'https://www.mintscan.io/umee/txs/',
    govV1: true,
    config: {
      chainId: 'umee-1',
      chainName: 'Umee',
      rest: 'https://api.resolute.vitwit.com',
      rpc: 'https://api.resolute.vitwit.com',
      restURIs: [
        'https://api.resolute.vitwit.com'
      ],
      rpcURIs: [
        'https://umee-rpc.quantnode.tech',
        'https://rpc-umee-ia.cosmosia.notional.ventures',
        'https://umee-rpc.polkachu.com',
        'https://api.resolute.vitwit.com/umee_rpc',
      ],
      currencies: [
        {
          coinDenom: 'UMEE',
          coinMinimalDenom: 'uumee',
          coinDecimals: 6,
        },
      ],
      bech32Config: {
        bech32PrefixAccAddr: 'umee',
        bech32PrefixAccPub: 'umeepub',
        bech32PrefixValAddr: 'umeevaloper',
        bech32PrefixValPub: 'umeevaloperpub',
        bech32PrefixConsAddr: 'umeegvalcons',
        bech32PrefixConsPub: 'umeevalconspub',
      },
      feeCurrencies: [
        {
          coinDenom: 'UMEE',
          coinMinimalDenom: 'uumee',
          coinDecimals: 6,
          gasPriceStep: {
            low: 0.01,
            average: 0.025,
            high: 0.03,
          },
        },
      ],
      bip44: {
        coinType: 118,
      },
      stakeCurrency: {
        coinDenom: 'UMEE',
        coinMinimalDenom: 'uumee',
        coinDecimals: 6,
      },
      image:
        'https://raw.githubusercontent.com/leapwallet/assets/2289486990e1eaf9395270fffd1c41ba344ef602/images/logo.svg',
      theme: {
        primaryColor: '#fff',
        gradient:
          'linear-gradient(180deg, #C9ACF260 0%, #12131C80 100%)',
      },
    },
    isCustomNetwork: false,
    supportedWallets: []
  },
  {
    enableModules: {
      authz: true,
      feegrant: true,
      group: false,
    },
    aminoConfig: {
      authz: false,
      feegrant: false,
      group: false,
    },
    showAirdrop: false,
    logos: {
      menu: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/celestia/images/celestia.svg',
      toolbar:
        'https://raw.githubusercontent.com/cosmos/chain-registry/master/celestia/images/celestia.svg',
    },
    supportedWallets: [KEPLR, LEAP, COSMOSTATION],
    keplrExperimental: false,
    leapExperimental: false,
    isTestnet: false,
    govV1: false,
    isCustomNetwork: false,
    explorerTxHashEndpoint: 'https://mintscan.io/celestia/txs/',
    config: {
      chainId: 'celestia',
      chainName: 'Celestia',
      rest: 'https://api.resolute.vitwit.com',
      rpc: 'https://public-celestia-rpc.numia.xyz',
      restURIs: ['https://api.resolute.vitwit.com'],
      rpcURIs: [
        'https://public-celestia-rpc.numia.xyz',
        'https://rpc.celestia.nodestake.top',
        'https://celestia-rpc.lavenderfive.com:443',
      ],
      currencies: [
        {
          coinDenom: 'TIA',
          coinMinimalDenom: 'utia',
          coinDecimals: 6,
        },
      ],
      bip44: {
        coinType: 118,
      },
      bech32Config: {
        bech32PrefixAccAddr: 'celestia',
        bech32PrefixAccPub: 'celestiapub',
        bech32PrefixValAddr: 'celestiavaloper',
        bech32PrefixValPub: 'celestiavaloperpub',
        bech32PrefixConsAddr: 'celestiavalcons',
        bech32PrefixConsPub: 'celestiavalconspub',
      },
      walletUrlForStaking: 'https://resolute.vitwit.com/celestia/staking',
      feeCurrencies: [
        {
          coinDenom: 'TIA',
          coinMinimalDenom: 'utia',
          coinDecimals: 6,
          coinGeckoId: 'celestia',
          gasPriceStep: {
            low: 0.01,
            average: 0.02,
            high: 0.1,
          },
        },
      ],
      stakeCurrency: {
        coinDenom: 'TIA',
        coinMinimalDenom: 'utia',
        coinDecimals: 6,
        coinGeckoId: 'celestia',
      },
      image:
        'https://raw.githubusercontent.com/cosmos/chain-registry/master/celestia/images/celestia.svg',
      theme: {
        primaryColor: '#7A2BF9',
        gradient: 'linear-gradient(180deg, #7A2BF960 0%, #12131C80 100%)',
      },
    },
  },
  {
    enableModules: {
      authz: true,
      feegrant: true,
      group: true,
    },
    aminoConfig: {
      authz: true,
      feegrant: true,
      group: false,
    },
    showAirdrop: false,
    logos: {
      menu: 'https://raw.githubusercontent.com/cosmos/chain-registry/839911133aaf453c42f0ffc56b0f6cfb52c33858/quasar/images/quasar.svg',
      toolbar:
        'https://raw.githubusercontent.com/cosmos/chain-registry/839911133aaf453c42f0ffc56b0f6cfb52c33858/quasar/images/quasar.svg',
    },
    keplrExperimental: false,
    leapExperimental: false,
    isTestnet: false,
    explorerTxHashEndpoint: 'https://www.mintscan.io/quasar/txs/',
    govV1: false,
    config: {
      chainId: 'quasar-1',
      chainName: 'Quasar',
      rest: 'https://api.resolute.vitwit.com',
      rpc: 'https://api.resolute.vitwit.com',
      restURIs: [
        'https://api.resolute.vitwit.com'
      ],
      rpcURIs: [
        'https://quasar-rpc.publicnode.com:443',
        'https://quasar-rpc.polkachu.com',
        'https://quasar-mainnet-rpc.autostake.com:443',
      ],
      currencies: [
        {
          coinDenom: 'QSR',
          coinMinimalDenom: 'uqsr',
          coinDecimals: 6,
        },
      ],
      bech32Config: {
        bech32PrefixAccAddr: 'quasar',
        bech32PrefixAccPub: 'quasarpub',
        bech32PrefixValAddr: 'quasarvaloper',
        bech32PrefixValPub: 'quasarvaloperpub',
        bech32PrefixConsAddr: 'quasargvalcons',
        bech32PrefixConsPub: 'quasarvalconspub',
      },
      feeCurrencies: [
        {
          coinDenom: 'QSR',
          coinMinimalDenom: 'uqsr',
          coinDecimals: 6,
          gasPriceStep: {
            low: 0.01,
            average: 0.025,
            high: 0.03,
          },
        },
      ],
      bip44: {
        coinType: 118,
      },
      stakeCurrency: {
        coinDenom: 'QSR',
        coinMinimalDenom: 'uqsr',
        coinDecimals: 6,
      },
      image:
        'https://raw.githubusercontent.com/cosmos/chain-registry/839911133aaf453c42f0ffc56b0f6cfb52c33858/quasar/images/quasar.svg',
      theme: {
        primaryColor: '#fff',
        gradient:
          'linear-gradient(180deg, #6DD4EF60 0%, #12131C80 100%)',
      },
    },
    isCustomNetwork: false,
    supportedWallets: []
  },
  {
    enableModules: {
      authz: true,
      feegrant: true,
      group: true,
    },
    aminoConfig: {
      authz: true,
      feegrant: true,
      group: false,
    },
    showAirdrop: false,
    logos: {
      menu: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/comdex/images/cmdx.png',
      toolbar:
        'https://raw.githubusercontent.com/cosmos/chain-registry/master/comdex/images/cmdx.png',
    },
    keplrExperimental: true,
    leapExperimental: true,
    isTestnet: false,
    explorerTxHashEndpoint: 'https://www.mintscan.io/comdex/txs/',
    govV1: true,
    config: {
      chainId: 'comdex-1',
      chainName: 'Comdex',
      rest: 'https://api.resolute.vitwit.com',
      rpc: 'https://api.resolute.vitwit.com',
      restURIs: [
        'https://api.resolute.vitwit.com'
      ],
      rpcURIs: [
        'https://rpc.comdex.one',
        'https://comdex-rpc.polkachu.com',
        'https://comdex-rpc.publicnode.com:443',
      ],
      currencies: [
        {
          coinDenom: 'CMDX',
          coinMinimalDenom: 'ucmdx',
          coinDecimals: 6,
        },
      ],
      bech32Config: {
        bech32PrefixAccAddr: 'comdex',
        bech32PrefixAccPub: 'comdexpub',
        bech32PrefixValAddr: 'comdexvaloper',
        bech32PrefixValPub: 'comdexvaloperpub',
        bech32PrefixConsAddr: 'comdexgvalcons',
        bech32PrefixConsPub: 'comdexvalconspub',
      },
      feeCurrencies: [
        {
          coinDenom: 'CMDX',
          coinMinimalDenom: 'ucmdx',
          coinDecimals: 6,
          gasPriceStep: {
            low: 0,
            average: 0.025,
            high: 0.04,
          },
        },
      ],
      bip44: {
        coinType: 118,
      },
      stakeCurrency: {
        coinDenom: 'CMDX',
        coinMinimalDenom: 'ucmdx',
        coinDecimals: 6,
      },
      image:
        'https://raw.githubusercontent.com/cosmos/chain-registry/master/comdex/images/cmdx.png',
      theme: {
        primaryColor: '#fff',
        gradient:
          'linear-gradient(180deg, #F2415060 0%, #12131C80 100%)',
      },
    },
    isCustomNetwork: false,
    supportedWallets: []
  },
  {
    enableModules: {
      authz: true,
      feegrant: true,
      group: true,
    },
    aminoConfig: {
      authz: true,
      feegrant: true,
      group: false,
    },
    showAirdrop: false,
    logos: {
      menu: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/gravitybridge/images/grav.png',
      toolbar:
        'https://raw.githubusercontent.com/cosmos/chain-registry/master/gravitybridge/images/grav.png',
    },
    keplrExperimental: false,
    leapExperimental: false,
    isTestnet: false,
    explorerTxHashEndpoint: 'https://www.mintscan.io/gravity-bridge/txs/',
    govV1: false,
    config: {
      chainId: 'gravity-bridge-3',
      chainName: 'GravityBridge',
      rest: 'https://api.resolute.vitwit.com',
      rpc: 'https://gravitybridge-rpc.lavenderfive.com',
      restURIs: [
        'https://api.resolute.vitwit.com'
      ],
      rpcURIs: [
        'https://gravitybridge-rpc.lavenderfive.com',
        'https://gravity-rpc.polkachu.com',
        'https://rpc-gravitybridge-ia.cosmosia.notional.ventures',
      ],
      currencies: [
        {
          coinDenom: 'GRAV',
          coinMinimalDenom: 'ugraviton',
          coinDecimals: 6,
        },
      ],
      bech32Config: {
        bech32PrefixAccAddr: 'gravity',
        bech32PrefixAccPub: 'gravitypub',
        bech32PrefixValAddr: 'gravityvaloper',
        bech32PrefixValPub: 'gravityvaloperpub',
        bech32PrefixConsAddr: 'gravitygvalcons',
        bech32PrefixConsPub: 'gravityvalconspub',
      },
      feeCurrencies: [
        {
          coinDenom: 'GRAV',
          coinMinimalDenom: 'ugraviton',
          coinDecimals: 6,
          gasPriceStep: {
            low: 0,
            average: 0,
            high: 0.035,
          },
        },
      ],
      bip44: {
        coinType: 118,
      },
      stakeCurrency: {
        coinDenom: 'GRAV',
        coinMinimalDenom: 'ugraviton',
        coinDecimals: 6,
      },
      image:
        'https://raw.githubusercontent.com/cosmos/chain-registry/master/gravitybridge/images/grav.png',
      theme: {
        primaryColor: '#fff',
        gradient:
          'linear-gradient(180deg, #0339A660 0%, #12131C80 100%)',
      },
    },
    isCustomNetwork: false,
    supportedWallets: []
  },
  {
    enableModules: {
      authz: true,
      feegrant: true,
      group: true,
    },
    aminoConfig: {
      authz: true,
      feegrant: true,
      group: false,
    },
    showAirdrop: false,
    logos: {
      menu: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/mars/images/mars-icon.png',
      toolbar:
        'https://raw.githubusercontent.com/cosmos/chain-registry/master/mars/images/mars-icon.png',
    },
    keplrExperimental: false,
    leapExperimental: false,
    isTestnet: false,
    explorerTxHashEndpoint: 'https://www.mintscan.io/mars-protocol/txs/',
    govV1: true,
    config: {
      chainId: 'mars-1',
      chainName: 'MarsHub',
      rest: 'https://api.resolute.vitwit.com',
      rpc: 'https://api.resolute.vitwit.com',
      restURIs: [
        'https://api.resolute.vitwit.com'
      ],
      rpcURIs: [
        'https://rpc.marsprotocol.io:443',
        'https://mars-rpc.lavenderfive.com:443',
        'https://mars-rest.publicnode.com',
      ],
      currencies: [
        {
          coinDenom: 'MARS',
          coinMinimalDenom: 'umars',
          coinDecimals: 6,
        },
      ],
      bech32Config: {
        bech32PrefixAccAddr: 'mars',
        bech32PrefixAccPub: 'marspub',
        bech32PrefixValAddr: 'marsvaloper',
        bech32PrefixValPub: 'marsvaloperpub',
        bech32PrefixConsAddr: 'marsgvalcons',
        bech32PrefixConsPub: 'marsvalconspub',
      },
      feeCurrencies: [
        {
          coinDenom: 'MARS',
          coinMinimalDenom: 'umars',
          coinDecimals: 6,
          gasPriceStep: {
            low: 0,
            average: 0,
            high: 0.01,
          },
        },
      ],
      bip44: {
        coinType: 118,
      },
      stakeCurrency: {
        coinDenom: 'MARS',
        coinMinimalDenom: 'umars',
        coinDecimals: 6,
      },
      image:
        'https://raw.githubusercontent.com/cosmos/chain-registry/master/mars/images/mars-icon.png',
      theme: {
        primaryColor: '#fff',
        gradient:
          'linear-gradient(180deg, #F2522E60 0%, #12131C80 100%)',
      },
    },
    isCustomNetwork: false,
    supportedWallets: []
  },
  {
    enableModules: {
      authz: true,
      feegrant: true,
      group: true,
    },
    aminoConfig: {
      authz: true,
      feegrant: true,
      group: false,
    },
    showAirdrop: false,
    logos: {
      menu: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/archway/images/archway.png',
      toolbar:
        'https://raw.githubusercontent.com/cosmos/chain-registry/master/archway/images/archway.png',
    },
    supportedWallets: ['KEPLR'],
    keplrExperimental: true,
    leapExperimental: false,
    isTestnet: false,
    isCustomNetwork: false,
    explorerTxHashEndpoint: 'https://www.mintscan.io/archway/txs/',
    govV1: false,
    config: {
      chainId: 'archway-1',
      chainName: 'Archway',
      rest: 'https://api.resolute.vitwit.com',
      rpc: 'https://api.resolute.vitwit.com',
      restURIs: ['https://api.resolute.vitwit.com'],
      rpcURIs: [
        'https://rpc.mainnet.archway.io',
        'https://archway-rpc.lavenderfive.com:443',
        'https://rpc.archway.nodestake.top',
      ],
      currencies: [
        {
          coinDenom: 'ARCH',
          coinMinimalDenom: 'aarch',
          coinDecimals: 18,
        },
      ],
      bech32Config: {
        bech32PrefixAccAddr: 'archway',
        bech32PrefixAccPub: 'archwaypub',
        bech32PrefixValAddr: 'archwayvaloper',
        bech32PrefixValPub: 'archwayvaloperpub',
        bech32PrefixConsAddr: 'archwaygvalcons',
        bech32PrefixConsPub: 'archwayvalconspub',
      },
      feeCurrencies: [
        {
          coinDenom: 'ARCH',
          coinMinimalDenom: 'aarch',
          coinDecimals: 18,
          gasPriceStep: {
            low: 1000000000000,
            average: 1500000000000,
            high: 2000000000000,
          },
        },
      ],
      bip44: {
        coinType: 118,
      },
      stakeCurrency: {
        coinDenom: 'ARCH',
        coinMinimalDenom: 'aarch',
        coinDecimals: 18,
      },
      image:
        'https://raw.githubusercontent.com/cosmos/chain-registry/master/archway/images/archway.png',
      theme: {
        primaryColor: '#F24405',
        gradient: 'linear-gradient(180deg, #F2440560 0%, #12131C80 100%)',
      },
    },
  },
  {
    enableModules: {
      authz: false,
      feegrant: false,
      group: false,
    },
    aminoConfig: {
      authz: true,
      feegrant: true,
      group: false,
    },
    showAirdrop: false,
    logos: {
      menu: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/noble/images/stake.png',
      toolbar:
        'https://raw.githubusercontent.com/cosmos/chain-registry/master/noble/images/stake.png',
    },
    supportedWallets: ['KEPLR'],
    keplrExperimental: true,
    leapExperimental: false,
    isTestnet: false,
    isCustomNetwork: false,
    explorerTxHashEndpoint: 'https://www.mintscan.io/noble/txs/',
    govV1: false,
    config: {
      chainId: 'noble-1',
      chainName: 'noble',
      rest: 'https://api.resolute.vitwit.com',
      rpc: 'https://api.resolute.vitwit.com',
      restURIs: ['https://api.resolute.vitwit.com'],
      rpcURIs: [
        'https://rpc.mainnet.archway.io',
        'https://archway-rpc.lavenderfive.com:443',
        'https://rpc.archway.nodestake.top',
      ],
      currencies: [
        {
          coinDenom: 'USDC',
          coinMinimalDenom: 'uusdc',
          coinDecimals: 6,
        },
      ],
      bech32Config: {
        bech32PrefixAccAddr: 'noble',
        bech32PrefixAccPub: 'noblepub',
        bech32PrefixValAddr: 'noblevaloper',
        bech32PrefixValPub: 'noblevaloperpub',
        bech32PrefixConsAddr: 'noblevalcons',
        bech32PrefixConsPub: 'noblevalconspub',
      },
      feeCurrencies: [
        {
          coinDenom: 'USDC',
          coinMinimalDenom: 'uusdc',
          coinDecimals: 6,
          gasPriceStep: {
            low: 0.01,
            average: 0.01,
            high: 0.02,
          },
        },
      ],
      bip44: {
        coinType: 118,
      },
      stakeCurrency: {
        coinDenom: 'USDC',
        coinMinimalDenom: 'uusdc',
        coinDecimals: 6,
      },
      image:
        'https://raw.githubusercontent.com/cosmos/chain-registry/master/noble/images/stake.png',
      theme: {
        primaryColor: '#a8bbfb',
        gradient: 'linear-gradient(180deg, #F2440560 0%, #12131C80 100%)',
      },
    },
  },
  {
    enableModules: {
      authz: false,
      feegrant: false,
      group: false,
    },
    aminoConfig: {
      authz: true,
      feegrant: true,
      group: false,
    },
    showAirdrop: false,
    logos: {
      menu: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/neutron-raw.png',
      toolbar:
        'https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/neutron-raw.png',
    },
    supportedWallets: ['KEPLR'],
    keplrExperimental: true,
    leapExperimental: false,
    isTestnet: false,
    isCustomNetwork: false,
    explorerTxHashEndpoint: 'https://www.mintscan.io/neutron/txs/',
    govV1: false,
    config: {
      chainId: 'neutron-1',
      chainName: 'neutron',
      rest: 'https://api.resolute.vitwit.com',
      rpc: 'https://api.resolute.vitwit.com',
      restURIs: ['https://api.resolute.vitwit.com'],
      rpcURIs: [
        'https://rpc.mainnet.archway.io',
        'https://archway-rpc.lavenderfive.com:443',
        'https://rpc.archway.nodestake.top',
      ],
      currencies: [
        {
          coinDenom: 'NTRN',
          coinMinimalDenom: 'untrn',
          coinDecimals: 6,
        },
      ],
      bech32Config: {
        bech32PrefixAccAddr: 'neutron',
        bech32PrefixAccPub: 'neutronpub',
        bech32PrefixValAddr: 'neutronvaloper',
        bech32PrefixValPub: 'neutronvaloperpub',
        bech32PrefixConsAddr: 'neutronvalcons',
        bech32PrefixConsPub: 'neutronvalconspub',
      },
      feeCurrencies: [
        {
          coinDenom: 'NTRN',
          coinMinimalDenom: 'untrn',
          coinDecimals: 6,
          gasPriceStep: {
            low: 0.0053,
            average: 0.0053,
            high: 0.0053,
          },
        },
      ],
      bip44: {
        coinType: 118,
      },
      stakeCurrency: {
        coinDenom: 'NTRN',
        coinMinimalDenom: 'untrn',
        coinDecimals: 6,
      },
      image:
        'https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/neutron-raw.png',
      theme: {
        primaryColor: '#000000',
        gradient: 'linear-gradient(180deg, #000000 0%, #12131C80 100%)',
      },
    },
  },
  {
    enableModules: {
      authz: false,
      feegrant: false,
      group: false,
    },
    aminoConfig: {
      authz: true,
      feegrant: true,
      group: false,
    },
    showAirdrop: false,
    logos: {
      menu: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/sentinel/images/dvpn.png',
      toolbar:
        'https://raw.githubusercontent.com/cosmos/chain-registry/master/sentinel/images/dvpn.png',
    },
    supportedWallets: ['KEPLR'],
    keplrExperimental: true,
    leapExperimental: false,
    isTestnet: false,
    isCustomNetwork: false,
    explorerTxHashEndpoint: 'https://www.mintscan.io/sentinel/txs/',
    govV1: false,
    config: {
      chainId: 'sentinelhub-2',
      chainName: 'sentinel',
      rest: 'https://api.resolute.vitwit.com',
      rpc: 'https://api.resolute.vitwit.com',
      restURIs: ['https://api.resolute.vitwit.com'],
      rpcURIs: [
        'https://rpc.mainnet.archway.io',
        'https://archway-rpc.lavenderfive.com:443',
        'https://rpc.archway.nodestake.top',
      ],
      currencies: [
        {
          coinDenom: 'DVPN',
          coinMinimalDenom: 'udvpn',
          coinDecimals: 6,
        },
      ],
      bech32Config: {
        bech32PrefixAccAddr: 'sent',
        bech32PrefixAccPub: 'sentpub',
        bech32PrefixValAddr: 'sentvaloper',
        bech32PrefixValPub: 'sentvaloperpub',
        bech32PrefixConsAddr: 'sentvalcons',
        bech32PrefixConsPub: 'sentvalconspub',
      },
      feeCurrencies: [
        {
          coinDenom: 'DVPN',
          coinMinimalDenom: 'udvpn',
          coinDecimals: 6,
          gasPriceStep: {
            low: 0.1,
            average: 0.25,
            high: 0.4,
          },
        },
      ],
      bip44: {
        coinType: 118,
      },
      stakeCurrency: {
        coinDenom: 'DVPN',
        coinMinimalDenom: 'udvpn',
        coinDecimals: 6,
      },
      image:
        'https://raw.githubusercontent.com/cosmos/chain-registry/master/sentinel/images/dvpn.png',
      theme: {
        primaryColor: '#10a7ef',
        gradient: 'linear-gradient(180deg, #10a7ef 0%, #12131C80 100%)',
      },
    },
  },
  {
    enableModules: {
      authz: false,
      feegrant: false,
      group: false,
    },
    aminoConfig: {
      authz: true,
      feegrant: true,
      group: false,
    },
    showAirdrop: false,
    logos: {
      menu: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/saga/images/saga.png',
      toolbar:
        'https://raw.githubusercontent.com/cosmos/chain-registry/master/saga/images/saga.png',
    },
    supportedWallets: ['KEPLR'],
    keplrExperimental: true,
    leapExperimental: false,
    isTestnet: false,
    isCustomNetwork: false,
    explorerTxHashEndpoint: 'https://www.mintscan.io/saga/txs/',
    govV1: false,
    config: {
      chainId: 'ssc-1',
      chainName: 'saga',
      rest: 'https://api.resolute.vitwit.com',
      rpc: 'https://api.resolute.vitwit.com',
      restURIs: ['https://api.resolute.vitwit.com'],
      rpcURIs: [
        'https://rpc.mainnet.archway.io',
        'https://archway-rpc.lavenderfive.com:443',
        'https://rpc.archway.nodestake.top',
      ],
      currencies: [
        {
          coinDenom: 'SAGA',
          coinMinimalDenom: 'usaga',
          coinDecimals: 6,
        },
      ],
      bech32Config: {
        bech32PrefixAccAddr: 'saga',
        bech32PrefixAccPub: 'sagapub',
        bech32PrefixValAddr: 'sagavaloper',
        bech32PrefixValPub: 'sagavaloperpub',
        bech32PrefixConsAddr: 'sagavalcons',
        bech32PrefixConsPub: 'sagavalconspub',
      },
      feeCurrencies: [
        {
          coinDenom: 'SAGA',
          coinMinimalDenom: 'usaga',
          coinDecimals: 6,
          gasPriceStep: {
            low: 0.01,
            average: 0.025,
            high: 0.04,
          },
        },
      ],
      bip44: {
        coinType: 118,
      },
      stakeCurrency: {
        coinDenom: 'STAKE',
        coinMinimalDenom: 'usaga',
        coinDecimals: 6,
      },
      image:
        'https://raw.githubusercontent.com/cosmos/chain-registry/master/saga/images/saga.png',
      theme: {
        primaryColor: '#040404',
        gradient: 'linear-gradient(180deg, #040404 0%, #12131C80 100%)',
      },
    },
  },
];
