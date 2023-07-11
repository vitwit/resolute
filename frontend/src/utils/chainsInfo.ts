export const networks: Network[] = [
  {
    enableModules: {
      authz: true,
      feegrant: true,
      group: false
    },
    aminoConfig: {
      authz: false,
      feegrant: false,
      group: false
    },
    showAirdrop: false,
    logos: {
      menu: "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/akash/images/akash.svg",
      toolbar: "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/akash/images/akash-logo.png"
    },
    experimental: false,
    isTestnet: false,
    explorerTxHashEndpoint: "https://www.mintscan.io/akash/txs/",
    config: {
      gasPriceStep: {
        low: 0.01,
        average: 0.025,
        high: 0.03
      },
      chainId: "akashnet-2",
      chainName: "AKASH",
      rest: "https://akash-api.polkachu.com",
      rpc: "https://rpc.akash.forbole.com/",
      currencies: [
        {
          coinDenom: "AKT",
          coinMinimalDenom: "uakt",
          coinDecimals: 6
        }
      ],
      bech32Config: {
        bech32PrefixAccAddr: "akash",
        bech32PrefixAccPub: "akashpub",
        bech32PrefixValAddr: "akashvaloper",
        bech32PrefixValPub: "akashvaloperpub",
        bech32PrefixConsAddr: "akashgvalcons",
        bech32PrefixConsPub: "akashvalconspub"
      }
    }
  },
  {
    enableModules: {
      authz: true,
      feegrant: true,
      group: false
    },
    aminoConfig: {
      authz: false,
      feegrant: false,
      group: false
    },
    showAirdrop: false,
    logos: {
      menu: "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/cosmoshub/images/cosmoshub.svg",
      toolbar: "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/cosmoshub/images/cosmoshub-logo.png"
    },
    experimental: false,
    isTestnet: false,
    explorerTxHashEndpoint: "https://www.mintscan.io/cosmos/txs/",
    config: {
      gasPriceStep: {
        low: 0.01,
        average: 0.025,
        high: 0.03
      },
      chainId: "cosmoshub-4",
      chainName: "CosmosHub",
      rest: "https://lcd-cosmoshub.blockapsis.com",
      rpc: "https://resolute.witval.com/cosmos_rpc/",
      currencies: [
        {
          coinDenom: "ATOM",
          coinMinimalDenom: "uatom",
          coinDecimals: 6
        }
      ],
      bech32Config: {
        bech32PrefixAccAddr: "cosmos",
        bech32PrefixAccPub: "cosmospub",
        bech32PrefixValAddr: "cosmosvaloper",
        bech32PrefixValPub: "cosmosvaloperpub",
        bech32PrefixConsAddr: "cosmosgvalcons",
        bech32PrefixConsPub: "cosmosvalconspub"
      }
    }
  },
  {
    enableModules: {
      authz: true,
      feegrant: true,
      group: false
    },
    aminoConfig: {
      authz: false,
      feegrant: false,
      group: false
    },
    showAirdrop: false,
    logos: {
      menu: "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/juno/images/juno.svg",
      toolbar: "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/juno/images/juno-logo.png"
    },
    experimental: false,
    isTestnet: false,
    explorerTxHashEndpoint: "https://www.mintscan.io/juno/txs/",
    config: {
      gasPriceStep: {
        low: 0.01,
        average: 0.025,
        high: 0.03
      },
      chainId: "juno-1",
      chainName: "Juno",
      rest: "https://juno-api.polkachu.com",
      rpc: "https://juno-rpc.polkachu.com",
      currencies: [
        {
          coinDenom: "JUNO",
          coinMinimalDenom: "ujuno",
          coinDecimals: 6
        }
      ],
      bech32Config: {
        bech32PrefixAccAddr: "juno",
        bech32PrefixAccPub: "junopub",
        bech32PrefixValAddr: "junovaloper",
        bech32PrefixValPub: "junovaloperpub",
        bech32PrefixConsAddr: "junogvalcons",
        bech32PrefixConsPub: "junovalconspub"
      }
    }
  },
  {
    enableModules: {
      authz: true,
      feegrant: true,
      group: false
    },
    aminoConfig: {
      authz: false,
      feegrant: false,
      group: false
    },
    showAirdrop: false,
    logos: {
      menu: "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/osmosis/images/osmosis.svg",
      toolbar: "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/osmosis/images/osmosis-logo.png"
    },
    experimental: false,
    isTestnet: false,
    explorerTxHashEndpoint: "https://www.mintscan.io/osmosis/txs/",
    config: {
      gasPriceStep: {
        low: 0.01,
        average: 0.025,
        high: 0.03
      },
      chainId: "osmosis-1",
      chainName: "Osmosis",
      rest: "https://osmosis-api.polkachu.com",
      rpc: "https://rpc.osmosis.zone/",
      currencies: [
        {
          coinDenom: "OSMO",
          coinMinimalDenom: "uosmo",
          coinDecimals: 6
        }
      ],
      bech32Config: {
        bech32PrefixAccAddr: "osmosis",
        bech32PrefixAccPub: "osmosispub",
        bech32PrefixValAddr: "osmosisvaloper",
        bech32PrefixValPub: "osmosisvaloperpub",
        bech32PrefixConsAddr: "osmosisgvalcons",
        bech32PrefixConsPub: "osmosisvalconspub"
      }
    }
  },
  {
    enableModules: {
      authz: true,
      feegrant: true,
      group: false
    },
    aminoConfig: {
      authz: false,
      feegrant: false,
      group: false
    },
    showAirdrop: true,
    logos: {
      toolbar: "https://raw.githubusercontent.com/vitwit/chain-registry/aleem/staking-assets/passage3d/images/passage3d-logo.png",
      menu: "https://raw.githubusercontent.com/vitwit/chain-registry/aleem/staking-assets/passage3d/images/passage.png"
    },
    experimental: true,
    isTestnet: false,
    explorerTxHashEndpoint: "https://passage.aneka.io/txs/",
    config: {
      gasPriceStep: {
        low: 0,
        average: 0,
        high: 0.01
      },
      chainId: "passage-1",
      chainName: "Passage",
      rest: "https://api.passage.vitwit.com/",
      rpc: "https://rpc.passage.vitwit.com",
      bip44: {
        coinType: 118
      },
      currencies: [
        {
          coinDenom: "PASG",
          coinMinimalDenom: "upasg",
          coinDecimals: 6,
          coinGeckoId: "passage"
        }
      ],
      coinType: 118,
      walletUrlForStaking: "https://resolute.vitwit.com/passage/staking",
      bech32Config: {
        bech32PrefixAccAddr: "passage",
        bech32PrefixAccPub: "passagepub",
        bech32PrefixValAddr: "passagevaloper",
        bech32PrefixValPub: "passagevaloperpub",
        bech32PrefixConsAddr: "passagegvalcons",
        bech32PrefixConsPub: "passagevalconspub"
      },
      feeCurrencies: [
        {
          coinDenom: "PASG",
          coinMinimalDenom: "upasg",
          coinDecimals: 6,
          coinGeckoId: "passage",
          gasPriceStep: {
            low: 0,
            average: 0,
            high: 0.01
          }
        }
      ]
    }
  },
  {
    enableModules: {
      authz: true,
      feegrant: true,
      group: true
    },
    aminoConfig: {
      authz: true,
      feegrant: true,
      group: false
    },
    showAirdrop: false,
    logos: {
      menu: "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/regen/images/regen.svg",
      toolbar: "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/regen/images/regen-logo.png"
    },
    experimental: false,
    isTestnet: false,
    explorerTxHashEndpoint: "https://www.mintscan.io/regen/txs/",
    config: {
      gasPriceStep: {
        low: 0.01,
        average: 0.025,
        high: 0.03
      },
      chainId: "regen-1",
      chainName: "Regen",
      rest: "https://regen.stakesystems.io",
      rpc: "https://rpc-regen.ecostake.com",
      currencies: [
        {
          coinDenom: "REGEN",
          coinMinimalDenom: "uregen",
          coinDecimals: 6
        }
      ],
      bech32Config: {
        bech32PrefixAccAddr: "regen",
        bech32PrefixAccPub: "regenpub",
        bech32PrefixValAddr: "regenvaloper",
        bech32PrefixValPub: "regenvaloperpub",
        bech32PrefixConsAddr: "regengvalcons",
        bech32PrefixConsPub: "regenvalconspub"
      }
    }
  },
  {
    enableModules: {
      authz: true,
      feegrant: true,
      group: false
    },
    aminoConfig: {
      authz: false,
      feegrant: false,
      group: false
    },
    showAirdrop: false,
    logos: {
      menu: "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/stargaze/images/stargaze.svg",
      toolbar: "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/stargaze/images/stargaze-logo.png"
    },
    experimental: false,
    isTestnet: false,
    explorerTxHashEndpoint: "https://www.mintscan.io/stargaze/txs/",
    config: {
      gasPriceStep: {
        low: 0.01,
        average: 0.025,
        high: 0.03
      },
      chainId: "stargaze-1",
      chainName: "Stargaze",
      rest: "https://rest.stargaze-apis.com/",
      rpc: "https://rpc.stargaze-apis.com/",
      currencies: [
        {
          coinDenom: "STARS",
          coinMinimalDenom: "ustars",
          coinDecimals: 6
        }
      ],
      bech32Config: {
        bech32PrefixAccAddr: "stars",
        bech32PrefixAccPub: "starspub",
        bech32PrefixValAddr: "starsvaloper",
        bech32PrefixValPub: "starsvaloperpub",
        bech32PrefixConsAddr: "starsgvalcons",
        bech32PrefixConsPub: "starsvalconspub"
      }
    }
  },
  {
    enableModules: {
      authz: true,
      feegrant: true,
      group: true
    },
    aminoConfig: {
      authz: true,
      feegrant: true,
      group: false
    },
    showAirdrop: false,
    logos: {
      menu: "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/umee/images/umee.svg",
      toolbar: "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/umee/images/umee-logo.png"
    },
    experimental: false,
    isTestnet: false,
    explorerTxHashEndpoint: "https://www.mintscan.io/umee/txs/",
    config: {
      gasPriceStep: {
        low: 0.01,
        average: 0.025,
        high: 0.03
      },
      chainId: "umee-1",
      chainName: "Umee",
      rest: "https://api.mainnet.network.umee.cc",
      rpc: "https://umee-rpc.polkachu.com",
      currencies: [
        {
          coinDenom: "UMEE",
          coinMinimalDenom: "uumee",
          coinDecimals: 6
        }
      ],
      bech32Config: {
        bech32PrefixAccAddr: "umee",
        bech32PrefixAccPub: "umeepub",
        bech32PrefixValAddr: "umeevaloper",
        bech32PrefixValPub: "umeevaloperpub",
        bech32PrefixConsAddr: "umeegvalcons",
        bech32PrefixConsPub: "umeevalconspub"
      }
    }
  }
];