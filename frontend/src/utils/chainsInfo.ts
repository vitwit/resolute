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
    keplrExperimental: false,
    leapExperimental: false,
    isTestnet: false,
    explorerTxHashEndpoint: "https://www.mintscan.io/akash/txs/",
    config: {
      chainId: "akashnet-2",
      chainName: "Akash",
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
      },
      bip44: {
        coinType: 118
      },
      feeCurrencies: [
        {
          coinDenom: "AKT",
          coinMinimalDenom: "uakt",
          coinDecimals: 6,
          gasPriceStep: {
            low: 0.01,
            average: 0.025,
            high: 0.03
          }
        }
      ],
      stakeCurrency: {
        coinDenom: "AKT",
        coinMinimalDenom: "uakt",
        coinDecimals: 6
      },
      image: "https://raw.githubusercontent.com/leapwallet/assets/2289486990e1eaf9395270fffd1c41ba344ef602/images/logo.svg",
      theme: {
        primaryColor: "#fff",
        gradient: "linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 100%)"
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
    keplrExperimental: false,
    leapExperimental: false,
    isTestnet: false,
    explorerTxHashEndpoint: "https://www.mintscan.io/cosmos/txs/",
    config: {
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
      },
      feeCurrencies: [
        {
          coinDenom: "ATOM",
          coinMinimalDenom: "uatom",
          coinDecimals: 6,
          gasPriceStep: {
            low: 0.01,
            average: 0.025,
            high: 0.03
          }
        }
      ],
      bip44: {
        coinType: 118
      },
      stakeCurrency: {
        coinDenom: "ATOM",
        coinMinimalDenom: "uatom",
        coinDecimals: 6
      },
      image: "https://raw.githubusercontent.com/leapwallet/assets/2289486990e1eaf9395270fffd1c41ba344ef602/images/logo.svg",
      theme: {
        primaryColor: "#fff",
        gradient: "linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 100%)"
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
      menu: "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/evmos/images/evmos.svg",
      toolbar: "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/evmos/images/evmos-logo.png"
    },
    keplrExperimental: false,
    leapExperimental: false,
    isTestnet: false,
    explorerTxHashEndpoint: "https://www.mintscan.io/evmos/txs/",
    config: {
      chainId: "evmos_9001-2",
      chainName: "Evmos",
      rest: "https://evmos.kingnodes.com",
      rpc: "https://rpc-evmos.ecostake.com",
      currencies: [
        {
          coinDenom: "EVMOS",
          coinMinimalDenom: "aevmos",
          coinDecimals: 18
        }
      ],
      bech32Config: {
        bech32PrefixAccAddr: "evmos",
        bech32PrefixAccPub: "evmospub",
        bech32PrefixValAddr: "evmosvaloper",
        bech32PrefixValPub: "evmosvaloperpub",
        bech32PrefixConsAddr: "evmosgvalcons",
        bech32PrefixConsPub: "evmosvalconspub"
      },
      feeCurrencies: [
        {
          coinDenom: "EVMOS",
          coinMinimalDenom: "aevmos",
          coinDecimals: 18,
          gasPriceStep: {
            low: 0.01,
            average: 0.025,
            high: 0.03
          }
        }
      ],
      bip44: {
        coinType: 60
      },
      stakeCurrency: {
        coinDenom: "ATOM",
        coinMinimalDenom: "uatom",
        coinDecimals: 6
      },
      image: "https://raw.githubusercontent.com/leapwallet/assets/2289486990e1eaf9395270fffd1c41ba344ef602/images/logo.svg",
      theme: {
        primaryColor: "#fff",
        gradient: "linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 100%)"
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
    keplrExperimental: false,
    leapExperimental: false,
    isTestnet: false,
    explorerTxHashEndpoint: "https://www.mintscan.io/juno/txs/",
    config: {
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
      },
      feeCurrencies: [
        {
          coinDenom: "JUNO",
          coinMinimalDenom: "ujuno",
          coinDecimals: 6,
          gasPriceStep: {
            low: 0.01,
            average: 0.025,
            high: 0.03
          }
        }
      ],
      bip44: {
        coinType: 118
      },
      stakeCurrency: {
        coinDenom: "JUNO",
        coinMinimalDenom: "ujuno",
        coinDecimals: 6
      },
      image: "https://raw.githubusercontent.com/leapwallet/assets/2289486990e1eaf9395270fffd1c41ba344ef602/images/logo.svg",
      theme: {
        primaryColor: "#fff",
        gradient: "linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 100%)"
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
    keplrExperimental: false,
    leapExperimental: false,
    isTestnet: false,
    explorerTxHashEndpoint: "https://www.mintscan.io/osmosis/txs/",
    config: {
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
      },
      feeCurrencies: [
        {
          coinDenom: "OSMO",
          coinMinimalDenom: "uosmo",
          coinDecimals: 6,
          gasPriceStep: {
            low: 0.01,
            average: 0.025,
            high: 0.03
          }
        }
      ],
      bip44: {
        coinType: 118
      },
      stakeCurrency: {
        coinDenom: "OSMO",
        coinMinimalDenom: "uosmo",
        coinDecimals: 6
      },
      image: "https://raw.githubusercontent.com/leapwallet/assets/2289486990e1eaf9395270fffd1c41ba344ef602/images/logo.svg",
      theme: {
        primaryColor: "#fff",
        gradient: "linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 100%)"
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
    keplrExperimental: true,
    leapExperimental: true,
    isTestnet: false,
    explorerTxHashEndpoint: "https://passage.aneka.io/txs/",
    config: {
      chainId: "passage-testnet-1",
      chainName: "Passage-testnet",
      rest: "https://api.resolute.vitwit.com/passage_testapi/",
      rpc: "https://api.resolute.vitwit.com/passage_testrpc/",
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
      walletUrlForStaking: "https://resolute.vitwit.com/passage/staking",
      bech32Config: {
        bech32PrefixAccAddr: "pasg",
        bech32PrefixAccPub: "pasgpub",
        bech32PrefixValAddr: "pasgvaloper",
        bech32PrefixValPub: "pasgvaloperpub",
        bech32PrefixConsAddr: "pasgvalcons",
        bech32PrefixConsPub: "pasgvalconspub"
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
      ],
      stakeCurrency: {
        coinDenom: "PASG",
        coinMinimalDenom: "upasg",
        coinDecimals: 6,
        coinGeckoId: "passage"
      },
      image: "https://raw.githubusercontent.com/leapwallet/assets/2289486990e1eaf9395270fffd1c41ba344ef602/images/logo.svg",
      theme: {
        primaryColor: "#fff",
        gradient: "linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 100%)"
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
    keplrExperimental: true,
    leapExperimental: true,
    isTestnet: false,
    explorerTxHashEndpoint: "https://passage.aneka.io/txs/",
    config: {
      chainId: "passage-2",
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
      walletUrlForStaking: "https://resolute.vitwit.com/passage/staking",
      bech32Config: {
        bech32PrefixAccAddr: "pasg",
        bech32PrefixAccPub: "pasgpub",
        bech32PrefixValAddr: "pasgvaloper",
        bech32PrefixValPub: "pasgvaloperpub",
        bech32PrefixConsAddr: "pasgvalcons",
        bech32PrefixConsPub: "pasgvalconspub"
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
      ],
      stakeCurrency: {
        coinDenom: "PASG",
        coinMinimalDenom: "upasg",
        coinDecimals: 6,
        coinGeckoId: "passage"
      },
      image: "https://raw.githubusercontent.com/leapwallet/assets/2289486990e1eaf9395270fffd1c41ba344ef602/images/logo.svg",
      theme: {
        primaryColor: "#fff",
        gradient: "linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 100%)"
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
      menu: "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/regen/images/regen.svg",
      toolbar: "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/regen/images/regen-logo.png"
    },
    keplrExperimental: false,
    leapExperimental: true,
    isTestnet: false,
    explorerTxHashEndpoint: "https://www.mintscan.io/regen/txs/",
    config: {
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
      },
      feeCurrencies: [
        {
          coinDenom: "REGEN",
          coinMinimalDenom: "uregen",
          coinDecimals: 6,
          gasPriceStep: {
            low: 0.01,
            average: 0.025,
            high: 0.03
          }
        }
      ],
      bip44: {
        coinType: 118
      },
      stakeCurrency: {
        coinDenom: "REGEN",
        coinMinimalDenom: "uregen",
        coinDecimals: 6
      },
      image: "https://raw.githubusercontent.com/leapwallet/assets/2289486990e1eaf9395270fffd1c41ba344ef602/images/logo.svg",
      theme: {
        primaryColor: "#fff",
        gradient: "linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 100%)"
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
      authz: false,
      feegrant: false,
      group: false
    },
    showAirdrop: false,
    logos: {
      menu: "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/cosmoshub/images/cosmoshub.svg",
      toolbar: "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/cosmoshub/images/cosmoshub-logo.png"
    },
    keplrExperimental: true,
    leapExperimental: true,
    isTestnet: false,
    explorerTxHashEndpoint: "http://127.0.0.1:1317/cosmos/tx/v1beta1/txs/",
    config: {
      chainId: "testnet",
      chainName: "Simapp",
      rest: "http://127.0.0.1:1317",
      rpc: "http://127.0.0.1:26657",
      currencies: [
        {
          coinDenom: "STAKE",
          coinMinimalDenom: "stake",
          coinDecimals: 6
        }
      ],
      bip44: {
        coinType: 118
      },
      bech32Config: {
        bech32PrefixAccAddr: "cosmos",
        bech32PrefixAccPub: "cosmospub",
        bech32PrefixValAddr: "cosmosvaloper",
        bech32PrefixValPub: "cosmosvaloperpub",
        bech32PrefixConsAddr: "cosmosgvalcons",
        bech32PrefixConsPub: "cosmosvalconspub"
      },
      walletUrlForStaking: "https://resolute.vitwit.com/simapp/staking",
      feeCurrencies: [
        {
          coinDenom: "STAKE",
          coinMinimalDenom: "stake",
          coinDecimals: 6,
          coinGeckoId: "stake",
          gasPriceStep: {
            low: 0,
            average: 0,
            high: 0.01
          }
        }
      ],
      stakeCurrency: {
        coinDenom: "STAKE",
        coinMinimalDenom: "stake",
        coinDecimals: 6,
        coinGeckoId: "stake"
      },
      image: "https://raw.githubusercontent.com/leapwallet/assets/2289486990e1eaf9395270fffd1c41ba344ef602/images/logo.svg",
      theme: {
        primaryColor: "#fff",
        gradient: "linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 100%)"
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
    keplrExperimental: false,
    leapExperimental: false,
    isTestnet: false,
    explorerTxHashEndpoint: "https://www.mintscan.io/stargaze/txs/",
    config: {
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
      },
      feeCurrencies: [
        {
          coinDenom: "STARS",
          coinMinimalDenom: "ustars",
          coinDecimals: 6,
          gasPriceStep: {
            low: 0.01,
            average: 0.025,
            high: 0.03
          }
        }
      ],
      bip44: {
        coinType: 118
      },
      stakeCurrency: {
        coinDenom: "STARS",
        coinMinimalDenom: "ustars",
        coinDecimals: 6
      },
      image: "https://raw.githubusercontent.com/leapwallet/assets/2289486990e1eaf9395270fffd1c41ba344ef602/images/logo.svg",
      theme: {
        primaryColor: "#fff",
        gradient: "linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 100%)"
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
    keplrExperimental: false,
    leapExperimental: false,
    isTestnet: false,
    explorerTxHashEndpoint: "https://www.mintscan.io/umee/txs/",
    config: {
      chainId: "umee-1",
      chainName: "Umee",
      rest: "https://api-umee-ia.cosmosia.notional.ventures",
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
      },
      feeCurrencies: [
        {
          coinDenom: "UMEE",
          coinMinimalDenom: "uumee",
          coinDecimals: 6,
          gasPriceStep: {
            low: 0.01,
            average: 0.025,
            high: 0.03
          }
        }
      ],
      bip44: {
        coinType: 118
      },
      stakeCurrency: {
        coinDenom: "UMEE",
        coinMinimalDenom: "uumee",
        coinDecimals: 6
      },
      image: "https://raw.githubusercontent.com/leapwallet/assets/2289486990e1eaf9395270fffd1c41ba344ef602/images/logo.svg",
      theme: {
        primaryColor: "#fff",
        gradient: "linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 100%)"
      }
    }
  }
];