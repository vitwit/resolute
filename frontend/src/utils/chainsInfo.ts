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
        menu: "https://raw.githubusercontent.com/vitwit/aneka-resources/d234799b2da3dc0b148829259866d07618b9773b/assets/agoric/bld.png",
        toolbar: "https://raw.githubusercontent.com/vitwit/chain-registry/master/agoric/images/bld.png"
      },
      keplrExperimental: false,
      leapExperimental: false,
      isTestnet: false,
      explorerTxHashEndpoint: "https://atomscan.com/agoric/transactions/",
      config: {
        chainId: "agoric-3",
        chainName: "Agoric",
        rest: "https://agoric-api.polkachu.com",
        rpc: "https://agoric-rpc.polkachu.com",
        currencies: [
          {
            coinDenom: "BLD",
            coinMinimalDenom: "ubld",
            coinDecimals: 6
          }
        ],
        bech32Config: {
          bech32PrefixAccAddr: "agoric",
          bech32PrefixAccPub: "agoricpub",
          bech32PrefixValAddr: "agoricvaloper",
          bech32PrefixValPub: "agoricvaloperpub",
          bech32PrefixConsAddr: "agoricgvalcons",
          bech32PrefixConsPub: "agoricvalconspub"
        },
        feeCurrencies: [
          {
            coinDenom: "BLD",
            coinMinimalDenom: "ubld",
            coinDecimals: 6,
            gasPriceStep: {
              low: 0.03,
              average: 0.05,
              high: 0.07
            }
          },
          {
            coinDenom: "IST",
            coinMinimalDenom: "uist",
            coinDecimals: 6,
            gasPriceStep: {
              low: 0.0034,
              average: 0.007,
              high: 0.02
            }
          }
        ],
        bip44: {
          coinType: 564
        },
        stakeCurrency: {
          coinDenom: "BLD",
          coinMinimalDenom: "ubld",
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
        menu: "https://raw.githubusercontent.com/vitwit/aneka-resources/d234799b2da3dc0b148829259866d07618b9773b/assets/akash/akt.png",
        toolbar: "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/akash/images/akash-logo.png"
      },
      keplrExperimental: false,
      leapExperimental: false,
      isTestnet: false,
      explorerTxHashEndpoint: "https://www.mintscan.io/akash/txs/",
      config: {
        chainId: "akashnet-2",
        chainName: "Akash",
        rest: "https://api.resolute.vitwit.com/akash_api",
        rpc: "https://api.resolute.vitwit.com/akash_rpc",
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
        menu: "https://raw.githubusercontent.com/vitwit/aneka-resources/d234799b2da3dc0b148829259866d07618b9773b/assets/cosmoshub/atom.png",
        toolbar: "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/cosmoshub/images/cosmoshub-logo.png"
      },
      keplrExperimental: false,
      leapExperimental: false,
      isTestnet: false,
      explorerTxHashEndpoint: "https://www.mintscan.io/cosmos/txs/",
      config: {
        chainId: "cosmoshub-4",
        chainName: "CosmosHub",
        rest: "https://api.resolute.vitwit.com/cosmos_api",
        rpc: "https://api.resolute.vitwit.com/cosmos_rpc",
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
        menu: "https://raw.githubusercontent.com/vitwit/aneka-resources/d234799b2da3dc0b148829259866d07618b9773b/assets/desmos/dsm.png",
        toolbar: "https://raw.githubusercontent.com/vitwit/chain-registry/master/desmos/images/dsm.png"
      },
      keplrExperimental: true,
      leapExperimental: true,
      isTestnet: false,
      explorerTxHashEndpoint: "https://www.mintscan.io/desmos/txs/",
      config: {
        chainId: "desmos-mainnet",
        chainName: "Desmos",
        rest: "https://api.resolute.vitwit.com/desmos_api",
        rpc: "https://api.resolute.vitwit.com/desmos_rpc",
        currencies: [
          {
            coinDenom: "DSM",
            coinMinimalDenom: "udsm",
            coinDecimals: 6
          }
        ],
        bech32Config: {
          bech32PrefixAccAddr: "desmos",
          bech32PrefixAccPub: "desmospub",
          bech32PrefixValAddr: "desmosvaloper",
          bech32PrefixValPub: "desmosvaloperpub",
          bech32PrefixConsAddr: "desmosgvalcons",
          bech32PrefixConsPub: "desmosvalconspub"
        },
        feeCurrencies: [
          {
            coinDenom: "DSM",
            coinMinimalDenom: "udsm",
            coinDecimals: 6,
            gasPriceStep: {
              low: 0.01,
              average: 0.03,
              high: 0.05
            }
          }
        ],
        bip44: {
          coinType: 118
        },
        stakeCurrency: {
          coinDenom: "DSM",
          coinMinimalDenom: "udsm",
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
        menu: "https://raw.githubusercontent.com/vitwit/aneka-resources/d234799b2da3dc0b148829259866d07618b9773b/assets/evmos/evmos.png",
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
        menu: "https://raw.githubusercontent.com/vitwit/aneka-resources/d234799b2da3dc0b148829259866d07618b9773b/assets/juno/juno.png",
        toolbar: "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/juno/images/juno-logo.png"
      },
      keplrExperimental: false,
      leapExperimental: false,
      isTestnet: false,
      explorerTxHashEndpoint: "https://www.mintscan.io/juno/txs/",
      config: {
        chainId: "juno-1",
        chainName: "Juno",
        rest: "https://api.resolute.vitwit.com/juno_api",
        rpc: "https://api.resolute.vitwit.com/juno_rpc",
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
        menu: "https://raw.githubusercontent.com/vitwit/aneka-resources/d234799b2da3dc0b148829259866d07618b9773b/assets/omniflixhub/flix.png",
        toolbar: "https://raw.githubusercontent.com/vitwit/chain-registry/master/omniflixhub/images/flix.png"
      },
      keplrExperimental: false,
      leapExperimental: false,
      isTestnet: false,
      explorerTxHashEndpoint: "https://www.mintscan.io/omniflix/txs/",
      config: {
        chainId: "omniflixhub-1",
        chainName: "OmniflixHub",
        rest: "https://api.resolute.vitwit.com/omniflix_api",
        rpc: "https://api.resolute.vitwit.com/omniflix_rpc",
        currencies: [
          {
            coinDenom: "FLIX",
            coinMinimalDenom: "uflix",
            coinDecimals: 6
          }
        ],
        bech32Config: {
          bech32PrefixAccAddr: "omniflix",
          bech32PrefixAccPub: "omniflixpub",
          bech32PrefixValAddr: "omniflixvaloper",
          bech32PrefixValPub: "omniflixvaloperpub",
          bech32PrefixConsAddr: "omniflixgvalcons",
          bech32PrefixConsPub: "omniflixvalconspub"
        },
        feeCurrencies: [
          {
            coinDenom: "FLIX",
            coinMinimalDenom: "uflix",
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
          coinDenom: "FLIX",
          coinMinimalDenom: "uflix",
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
        menu: "https://raw.githubusercontent.com/vitwit/aneka-resources/d234799b2da3dc0b148829259866d07618b9773b/assets/osmosis/osmo.png",
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
        rpc: "https://rpc.osmosis.zone",
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
        menu: "https://raw.githubusercontent.com/vitwit/aneka-resources/d234799b2da3dc0b148829259866d07618b9773b/assets/passage/pasg.png",
        toolbar: "https://raw.githubusercontent.com/vitwit/chain-registry/aleem/staking-assets/passage3d/images/passage3d-logo.png"
      },
      keplrExperimental: true,
      leapExperimental: true,
      isTestnet: false,
      explorerTxHashEndpoint: "https://passage.aneka.io/txs/",
      config: {
        chainId: "passage-testnet-1",
        chainName: "Passage-testnet",
        rest: "https://api.resolute.vitwit.com/passage_testapi",
        rpc: "https://api.resolute.vitwit.com/passage_testrpc",
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
        menu: "https://raw.githubusercontent.com/vitwit/aneka-resources/d234799b2da3dc0b148829259866d07618b9773b/assets/passage/pasg.png",
        toolbar: "https://raw.githubusercontent.com/vitwit/chain-registry/aleem/staking-assets/passage3d/images/passage3d-logo.png"
      },
      keplrExperimental: true,
      leapExperimental: true,
      isTestnet: false,
      explorerTxHashEndpoint: "https://passage.aneka.io/txs/",
      config: {
        chainId: "passage-2",
        chainName: "Passage",
        rest: "https://api.passage.vitwit.com",
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
        group: false
      },
      aminoConfig: {
        authz: false,
        feegrant: false,
        group: false
      },
      showAirdrop: false,
      logos: {
        menu: "https://raw.githubusercontent.com/vitwit/aneka-resources/d234799b2da3dc0b148829259866d07618b9773b/assets/quicksilver/qck.png",
        toolbar: "https://raw.githubusercontent.com/vitwit/chain-registry/master/quicksilver/images/quicksilver-chain-logo.png"
      },
      keplrExperimental: false,
      leapExperimental: false,
      isTestnet: false,
      explorerTxHashEndpoint: "https://www.mintscan.io/quicksilver/txs/",
      config: {
        chainId: "quicksilver-2",
        chainName: "Quicksilver",
        rest: "https://api.resolute.vitwit.com/quicksilver_api",
        rpc: "https://api.resolute.vitwit.com/quicksilver_rpc",
        currencies: [
          {
            coinDenom: "QCK",
            coinMinimalDenom: "uqck",
            coinDecimals: 6
          }
        ],
        bech32Config: {
          bech32PrefixAccAddr: "quick",
          bech32PrefixAccPub: "quickpub",
          bech32PrefixValAddr: "quickvaloper",
          bech32PrefixValPub: "quickvaloperpub",
          bech32PrefixConsAddr: "quickgvalcons",
          bech32PrefixConsPub: "quickvalconspub"
        },
        bip44: {
          coinType: 118
        },
        feeCurrencies: [
          {
            coinDenom: "QCK",
            coinMinimalDenom: "uqck",
            coinDecimals: 6,
            gasPriceStep: {
              low: 0.0001,
              average: 0.0001,
              high: 0.00025
            }
          }
        ],
        stakeCurrency: {
          coinDenom: "QCK",
          coinMinimalDenom: "uqck",
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
        menu: "https://raw.githubusercontent.com/vitwit/aneka-resources/d234799b2da3dc0b148829259866d07618b9773b/assets/regen/regen.png",
        toolbar: "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/regen/images/regen-logo.png"
      },
      keplrExperimental: false,
      leapExperimental: true,
      isTestnet: false,
      explorerTxHashEndpoint: "https://www.mintscan.io/regen/txs/",
      config: {
        chainId: "regen-1",
        chainName: "Regen",
        rest: "https://api.resolute.vitwit.com/regen_api",
        rpc: "https://api.resolute.vitwit.com/regen_rpc",
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
        group: false
      },
      aminoConfig: {
        authz: false,
        feegrant: false,
        group: false
      },
      showAirdrop: false,
      logos: {
        menu: "https://raw.githubusercontent.com/vitwit/aneka-resources/d234799b2da3dc0b148829259866d07618b9773b/assets/stargaze/stars.png",
        toolbar: "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/stargaze/images/stargaze-logo.png"
      },
      keplrExperimental: false,
      leapExperimental: false,
      isTestnet: false,
      explorerTxHashEndpoint: "https://www.mintscan.io/stargaze/txs/",
      config: {
        chainId: "stargaze-1",
        chainName: "Stargaze",
        rest: "https://api.resolute.vitwit.com/stargaze_api",
        rpc: "https://api.resolute.vitwit.com/stargaze_rpc",
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
        group: false
      },
      aminoConfig: {
        authz: false,
        feegrant: false,
        group: false
      },
      showAirdrop: false,
      logos: {
        menu: "https://raw.githubusercontent.com/vitwit/aneka-resources/d234799b2da3dc0b148829259866d07618b9773b/assets/tgrade/tgrade.png",
        toolbar: "https://raw.githubusercontent.com/vitwit/chain-registry/master/tgrade/images/tgrade-logo-gradient_h.png"
      },
      keplrExperimental: false,
      leapExperimental: false,
      isTestnet: false,
      explorerTxHashEndpoint: "https://www.mintscan.io/tgrade/txs/",
      config: {
        chainId: "tgrade-mainnet-1",
        chainName: "Tgrade",
        rest: "https://api.resolute.vitwit.com/tgrade_api",
        rpc: "https://api.resolute.vitwit.com/tgrade_rpc",
        currencies: [
          {
            coinDenom: "TGD",
            coinMinimalDenom: "utgd",
            coinDecimals: 6
          }
        ],
        bech32Config: {
          bech32PrefixAccAddr: "tgrade",
          bech32PrefixAccPub: "tgradepub",
          bech32PrefixValAddr: "tgradevaloper",
          bech32PrefixValPub: "tgradevaloperpub",
          bech32PrefixConsAddr: "tgradegvalcons",
          bech32PrefixConsPub: "tgradevalconspub"
        },
        feeCurrencies: [
          {
            coinDenom: "TGD",
            coinMinimalDenom: "utgd",
            coinDecimals: 6,
            gasPriceStep: {
              low: 0.05,
              average: 0.075,
              high: 0.1
            }
          }
        ],
        bip44: {
          coinType: 118
        },
        stakeCurrency: {
          coinDenom: "TGD",
          coinMinimalDenom: "utgd",
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
        menu: "https://raw.githubusercontent.com/vitwit/aneka-resources/d234799b2da3dc0b148829259866d07618b9773b/assets/umee/umee.png",
        toolbar: "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/umee/images/umee-logo.png"
      },
      keplrExperimental: false,
      leapExperimental: false,
      isTestnet: false,
      explorerTxHashEndpoint: "https://www.mintscan.io/umee/txs/",
      config: {
        chainId: "umee-1",
        chainName: "Umee",
        rest: "https://api.resolute.vitwit.com/umee_api",
        rpc: "https://api.resolute.vitwit.com/umee_rpc",
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