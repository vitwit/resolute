// add mainnet here
const mainNets: Network[] = [
  {
    aminoConfig: {
      authz: false,
      feegrant: false,
      group: false,
    },
    showAirdrop: false,
    logos: {
      menu: "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/cosmoshub/images/cosmoshub.svg",
      toolbar:
        "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/cosmoshub/images/cosmoshub-logo.png",
    },
    experimental: false,
    isTestnet: false,
    explorerTxHashEndpoint: "https://www.mintscan.io/cosmos/txs/",
    config: {
      chainId: "cosmoshub-4",
      chainName: "Cosmos Hub",
      rest: "https://resolute.witval.com/cosmos_api",
      rpc: "https://resolute.witval.com/cosmos_rpc/",
      gasPriceStep: { low: 0.01, average: 0.025, high: 0.03 },
      currencies: [
        { coinDenom: "ATOM", coinMinimalDenom: "uatom", coinDecimals: 6 },
      ],
      bech32Config: {
        bech32PrefixAccAddr: `cosmos`,
        bech32PrefixAccPub: `cosmospub`,
        bech32PrefixValAddr: `cosmosvaloper`,
        bech32PrefixValPub: `cosmosvaloperpub`,
        bech32PrefixConsAddr: `cosmosgvalcons`,
        bech32PrefixConsPub: `cosmosvalconspub`,
      },
      enableAuthz: true,
      enableFeegrant: true,
      enableGroup: true,
    },
  },
  {
    aminoConfig: {
      authz: false,
      feegrant: false,
      group: false,
    },
    experimental: true,
    showAirdrop: true,
    airdropActions: [{ title: "#1 Initial Claim", type: "action" }],
    airdropMessage:
      "Additional bonus will be credited if staked 50% of airdrop for 14+ months.",
    logos: {
      toolbar:
        "https://raw.githubusercontent.com/vitwit/chain-registry/aleem/staking-assets/passage3d/images/passage3d-logo.png",
      menu: "https://raw.githubusercontent.com/vitwit/chain-registry/aleem/staking-assets/passage3d/images/passage.png",
    },
    isTestnet: false,
    explorerTxHashEndpoint: "https://passage.aneka.io/txs/",
    config: {
      chainId: "passage-1",
      chainName: "Passage",
      rest: "https://api.passage.vitwit.com/",
      rpc: "https://rpc.passage.vitwit.com",
      stakeCurrency: {
        coinDenom: "PASG",
        coinMinimalDenom: "upasg",
        coinDecimals: 6,
        coinGeckoId: "passage3d",
      },
      bip44: { coinType: 118 },
      bech32Config: {
        bech32PrefixAccAddr: `pasg`,
        bech32PrefixAccPub: `pasgpub`,
        bech32PrefixValAddr: `pasgvaloper`,
        bech32PrefixValPub: `pasgvaloperpub`,
        bech32PrefixConsAddr: `pasgvalcons`,
        bech32PrefixConsPub: `pasgvalconspub`,
      },
      currencies: [
        {
          coinDenom: "PASG",
          coinMinimalDenom: "upasg",
          coinDecimals: 6,
          coinGeckoId: "passage",
        },
      ],
      feeCurrencies: [
        {
          coinDenom: "PASG",
          coinMinimalDenom: "upasg",
          coinDecimals: 6,
          coinGeckoId: "passage",
        },
      ],
      coinType: 118,
      gasPriceStep: { low: 0.0, average: 0.0, high: 0.0 },
      walletUrlForStaking: "https://resolute.vitwit.com/staking",
      enableAuthz: true,
      enableFeegrant: false,
      enableGroup: false,
    },
  },
  {
    aminoConfig: {
      authz: false,
      feegrant: false,
      group: false,
    },
    showAirdrop: false,
    logos: {
      toolbar:
        "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/regen/images/regen-logo.png",
      menu: "https://raw.githubusercontent.com/vitwit/chain-registry/ae0dd6a251d67945e87b168c7ae8521d0c370415/regen/images/regen.svg",
    },
    experimental: false,
    isTestnet: false,
    explorerTxHashEndpoint: "https://www.mintscan.io/regen/txs/",
    config: {
      chainId: "regen-1",
      chainName: "Regen",
      rest: "https://resolute.witval.com/regen_api",
      rpc: "https://resolute.witval.com/regen_rpc/",
      gasPriceStep: { low: 0.015, average: 0.03, high: 0.04 },
      currencies: [
        { coinDenom: "REGEN", coinMinimalDenom: "uregen", coinDecimals: 6 },
      ],
      bech32Config: {
        bech32PrefixAccAddr: `regen`,
        bech32PrefixAccPub: `regenpub`,
        bech32PrefixValAddr: `regenvaloper`,
        bech32PrefixValPub: `regenvaloperpub`,
        bech32PrefixConsAddr: `regenvalcons`,
        bech32PrefixConsPub: `regenvalconspub`,
      },
      enableAuthz: true,
      enableFeegrant: false,
      enableGroup: false,
    },
  },
  {
    aminoConfig: {
      authz: false,
      feegrant: false,
      group: false,
    },
    showAirdrop: false,
    logos: {
      toolbar:
        "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/akash/images/akash-logo.svg",
      menu: "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/akash/images/akash.svg",
    },
    experimental: false,
    isTestnet: false,
    explorerTxHashEndpoint: "https://www.mintscan.io/akash/txs/",
    config: {
      chainId: "akashnet-2",
      chainName: "Akash",
      rest: " https://resolute.witval.com/akash_api",
      rpc: "https://resolute.witval.com/akash_rpc/",
      gasPriceStep: { low: 0.015, average: 0.03, high: 0.04 },
      currencies: [
        { coinDenom: "AKT", coinMinimalDenom: "uakt", coinDecimals: 6 },
      ],
      bech32Config: {
        bech32PrefixAccAddr: `akash`,
        bech32PrefixAccPub: `akashpub`,
        bech32PrefixValAddr: `akashvaloper`,
        bech32PrefixValPub: `akashvaloperpub`,
        bech32PrefixConsAddr: `akashvalcons`,
        bech32PrefixConsPub: `akashvalconspub`,
      },
      enableAuthz: true,
      enableFeegrant: false,
      enableGroup: false,
    },
  },
  {
    aminoConfig: {
      authz: false,
      feegrant: false,
      group: false,
    },
    logos: {
      toolbar:
        "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/osmosis/images/osmosis-logo.svg",
      menu: "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/osmosis/images/osmosis.svg",
    },
    showAirdrop: false,
    experimental: false,
    isTestnet: false,
    explorerTxHashEndpoint: "https://www.mintscan.io/osmosis/txs/",
    config: {
      chainId: "osmosis-1",
      chainName: "Osmosis",
      rest: "https://resolute.witval.com/osmosis_api",
      rpc: "https://resolute.witval.com/osmosis_rpc/",
      currencies: [
        { coinDenom: "OSMO", coinMinimalDenom: "uosmo", coinDecimals: 6 },
      ],
      gasPriceStep: { low: 0.01, average: 0.025, high: 0.03 },
      bech32Config: {
        bech32PrefixAccAddr: `osmosis`,
        bech32PrefixAccPub: `osmosispub`,
        bech32PrefixValAddr: `osmosisvaloper`,
        bech32PrefixValPub: `osmosisvaloperpub`,
        bech32PrefixConsAddr: `osmosisvalcons`,
        bech32PrefixConsPub: `osmosisvalconspub`,
      },
      enableAuthz: true,
      enableFeegrant: false,
      enableGroup: false,
    },
  },
  {
    aminoConfig: {
      authz: false,
      feegrant: false,
      group: false,
    },
    logos: {
      toolbar:
        "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/cosmoshub/images/cosmoshub-logo.png",
      menu: "https://www.mintscan.io/_next/static/image/assets/header/token_juno.a36436fb7578f1014a6fc3f505b19457.svg",
    },
    showAirdrop: false,
    experimental: false,
    isTestnet: false,
    explorerTxHashEndpoint: "https://www.mintscan.io/juno/txs/",
    config: {
      chainId: "juno-1",
      chainName: "Juno",
      rest: "https://resolute.witval.com/juno_api",
      rpc: "https://resolute.witval.com/juno_rpc/",
      currencies: [
        { coinDenom: "JUNO", coinMinimalDenom: "ujuno", coinDecimals: 6 },
      ],
      gasPriceStep: { low: 0.01, average: 0.025, high: 0.03 },
      bech32Config: {
        bech32PrefixAccAddr: `juno`,
        bech32PrefixAccPub: `junopub`,
        bech32PrefixValAddr: `junovaloper`,
        bech32PrefixValPub: `junovaloperpub`,
        bech32PrefixConsAddr: `junovalcons`,
        bech32PrefixConsPub: `junovalconspub`,
      },
      enableAuthz: true,
      enableFeegrant: false,
      enableGroup: false,
    },
  },
  // {
  //   aminoConfig: {
  //     authz: false,
  //     feegrant: false,
  //     group: false,
  //   },
  //   logos: {
  //     toolbar:
  //       "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/cosmoshub/images/cosmoshub-logo.png",
  //     menu: "https://www.mintscan.io/_next/static/image/assets/header/token_juno.a36436fb7578f1014a6fc3f505b19457.svg",
  //   },
  //   showAirdrop: false,
  //   experimental: false,
  //   isTestnet: false,
  //   explorerTxHashEndpoint: "https://www.mintscan.io/juno/txs/",
  //   config: {
  //     chainId: "evmos_9001-2",
  //     chainName: "Evmos",
  //     rest: "https://api-evmos-ia.cosmosia.notional.ventures/",
  //     rpc: "https://evmos-api.lavenderfive.com:443",
  //     currencies: [
  //       { coinDenom: "EVMOS", coinMinimalDenom: "aevmos", coinDecimals: 18 },
  //     ],
  //     gasPriceStep: { low: 0.01, average: 0.025, high: 0.03 },
  //     bech32Config: {
  //       bech32PrefixAccAddr: `evmos`,
  //       bech32PrefixAccPub: `evmospub`,
  //       bech32PrefixValAddr: `evmosvaloper`,
  //       bech32PrefixValPub: `evmosvaloperpub`,
  //       bech32PrefixConsAddr: `evmosvalcons`,
  //       bech32PrefixConsPub: `evmosvalconspub`,
  //     },
  //   },
  // },
  {
    aminoConfig: {
      authz: false,
      feegrant: false,
      group: false,
    },
    logos: {
      toolbar:
        "https://raw.githubusercontent.com/vitwit/chain-registry/cb6119d4d5c38d98904e4b3e7572f1ebe123c66c/stargaze/images/stargaze-logo.svg",
      menu: "https://www.mintscan.io/_next/static/image/assets/header/token_stargaze.ae37b2d9c160b6fb95062f2822179a01.svg",
    },
    showAirdrop: false,
    experimental: false,
    isTestnet: false,
    explorerTxHashEndpoint: "https://www.mintscan.io/stargaze/txs/",
    config: {
      chainId: "stargaze-1",
      chainName: "Stargaze",
      rest: "https://resolute.witval.com/stargaze_api",
      rpc: "https://resolute.witval.com/stargaze_rpc/",
      currencies: [
        { coinDenom: "STARS", coinMinimalDenom: "ustars", coinDecimals: 6 },
      ],
      gasPriceStep: { low: 0.01, average: 0.025, high: 0.03 },
      bech32Config: {
        bech32PrefixAccAddr: `stars`,
        bech32PrefixAccPub: `starspub`,
        bech32PrefixValAddr: `starsvaloper`,
        bech32PrefixValPub: `starsvaloperpub`,
        bech32PrefixConsAddr: `starsvalcons`,
        bech32PrefixConsPub: `starsvalconspub`,
      },
      enableAuthz: true,
      enableFeegrant: false,
      enableGroup: false,
    },
  },
  // {
  //   aminoConfig: {
  //     authz: false,
  //     feegrant: false,
  //     group: false,
  //   },
  //   logos: {
  //     toolbar:
  //       "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/osmosis/images/osmosis-logo.svg",
  //     menu: "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/osmosis/images/osmosis.svg",
  //   },
  //   showAirdrop: false,
  //   experimental: false,
  //   isTestnet: false,
  //   explorerTxHashEndpoint: "https://www.mintscan.io/evmos/txs/",
  //   config: {
  //     chainId: "evmos_9001-2",
  //     chainName: "Evmos",
  //     rest: "https://api.evmos.interbloc.org",
  //     rpc: "https://rpc-evmos-ia.cosmosia.notional.ventures/",
  //     currencies: [
  //       { coinDenom: "EVMOS", coinMinimalDenom: "aevmos", coinDecimals: 18 },
  //     ],
  //     gasPriceStep: { low: 0.01, average: 0.025, high: 0.03 },
  //     bech32Config: {
  //       bech32PrefixAccAddr: `evmos`,
  //       bech32PrefixAccPub: `evmospub`,
  //       bech32PrefixValAddr: `evmosvaloper`,
  //       bech32PrefixValPub: `evmosvaloperpub`,
  //       bech32PrefixConsAddr: `evmosvalcons`,
  //       bech32PrefixConsPub: `evmosvalconspub`,
  //     },
  //   },
  // },
];

// add testnet here
const testNets: Network[] = [];

export function getMainNetworks(): Network[] {
  if (window.location.origin === "https://airdrop.passage3d.com") {
    return [
      {
        aminoConfig: {
          authz: false,
          feegrant: false,
          group: false,
        },
        experimental: true,
        showAirdrop: true,
        airdropActions: [{ title: "#1 Initial Claim", type: "action" }],
        airdropMessage:
          "Additional bonus will be credited if staked 50% of airdrop for 14+ months.",
        logos: {
          toolbar:
            "https://raw.githubusercontent.com/vitwit/chain-registry/aleem/staking-assets/passage3d/images/passage3d-logo.png",
          menu: "https://raw.githubusercontent.com/vitwit/chain-registry/aleem/staking-assets/passage3d/images/passage.png",
        },
        isTestnet: false,
        explorerTxHashEndpoint: "https://passage.aneka.io/txs/",
        config: {
          chainId: "passage-1",
          chainName: "Passage",
          rest: "https://api.passage.vitwit.com/",
          rpc: "https://rpc.passage.vitwit.com",
          stakeCurrency: {
            coinDenom: "PASG",
            coinMinimalDenom: "upasg",
            coinDecimals: 6,
            coinGeckoId: "passage3d",
          },
          bip44: { coinType: 118 },
          bech32Config: {
            bech32PrefixAccAddr: `pasg`,
            bech32PrefixAccPub: `pasgpub`,
            bech32PrefixValAddr: `pasgvaloper`,
            bech32PrefixValPub: `pasgvaloperpub`,
            bech32PrefixConsAddr: `pasgvalcons`,
            bech32PrefixConsPub: `pasgvalconspub`,
          },
          currencies: [
            {
              coinDenom: "PASG",
              coinMinimalDenom: "upasg",
              coinDecimals: 6,
              coinGeckoId: "passage",
            },
          ],
          feeCurrencies: [
            {
              coinDenom: "PASG",
              coinMinimalDenom: "upasg",
              coinDecimals: 6,
              coinGeckoId: "passage",
            },
          ],
          coinType: 118,
          gasPriceStep: { low: 0.0, average: 0.0, high: 0.0 },
          walletUrlForStaking: "https://airdrop.passage3d.com/staking",
          enableAuthz: true,
          enableFeegrant: false,
          enableGroup: false,
        },
      },
    ];
  }
  return mainNets;
}

export function getNetworkByChainId(chainId: string): Network | null {
  const mainNets = getMainNetworks();
  for (let i = 0; i < mainNets.length; i++) {
    if (mainNets[i].config.chainId === chainId) {
      return mainNets[i];
    }
  }

  const testNets = getTestNetworks();
  for (let i = 0; i < testNets.length; i++) {
    if (testNets[i].config.chainId === chainId) {
      return testNets[i];
    }
  }

  return null;
}

export function getTestNetworks(): Network[] {
  if (window.location.origin === "http://localhost:3000") {
    return [
      {
        aminoConfig: {
          authz: false,
          feegrant: false,
          group: false,
        },
        experimental: true,
        showAirdrop: false,
        logos: {
          toolbar:
            "https://raw.githubusercontent.com/vitwit/chain-registry/aleem/staking-assets/passage3d/images/passage3d-logo.png",
          menu: "https://raw.githubusercontent.com/vitwit/chain-registry/aleem/staking-assets/passage3d/images/passage.png",
        },
        isTestnet: true,
        explorerTxHashEndpoint: "https://passage3d.testaneka.com/txs/",
        config: {
          chainId: "test",
          chainName: "Simapp",
          rest: "http://127.0.0.1:1317",
          rpc: "http://127.0.0.1:16657",
          stakeCurrency: {
            coinDenom: "STAKE",
            coinMinimalDenom: "uatom",
            coinDecimals: 6,
            coinGeckoId: "stake",
          },
          bip44: { coinType: 118 },
          bech32Config: {
            bech32PrefixAccAddr: `cosmos`,
            bech32PrefixAccPub: `cosmospub`,
            bech32PrefixValAddr: `cosmosvaloper`,
            bech32PrefixValPub: `cosmosvaloperpub`,
            bech32PrefixConsAddr: `cosmosvalcons`,
            bech32PrefixConsPub: `cosmosvalconspub`,
          },
          currencies: [
            {
              coinDenom: "STAKE",
              coinMinimalDenom: "uatom",
              coinDecimals: 6,
              coinGeckoId: "stake",
            },
          ],
          feeCurrencies: [
            {
              coinDenom: "STAKE",
              coinMinimalDenom: "uatom",
              coinDecimals: 6,
              coinGeckoId: "stake",
            },
          ],
          coinType: 118,
          gasPriceStep: { low: 0.0, average: 0.01, high: 0.2 },
          walletUrlForStaking: "http://localhost:3000/validators",
          enableAuthz: true,
          enableFeegrant: true,
          enableGroup: true,
        },
      },
    ];
  }

  return testNets;
}

export function getSelectedNetwork(): Network | null {
  let name = localStorage.getItem("LAST_SELECTED");
  let mainNets = getMainNetworks();
  if (name != null) {
    for (let i = 0; i < mainNets?.length; i++) {
      if (mainNets[i].config.chainName === name) {
        saveSelectedNetwork(mainNets[i].config.chainName);
        return mainNets[i];
      }
    }
  }
  let testNets = getTestNetworks();
  if (name != null) {
    for (let i = 0; i < testNets?.length; i++) {
      if (testNets[i].config.chainName === name) {
        saveSelectedNetwork(testNets[i].config.chainName);
        return testNets[i];
      }
    }
  }

  // return passage network if provided network is not present
  if (testNets?.length > 0) {
    saveSelectedNetwork(testNets[0].config.chainName);
    return testNets[0];
  }
  if (mainNets?.length > 0) {
    for (let i = 0; i < mainNets.length; i++) {
      if (mainNets[i].config.chainName === "Passage") {
        saveSelectedNetwork(mainNets[i].config.chainName);
        return mainNets[i];
      }
    }
    saveSelectedNetwork(mainNets[0].config.chainName);
    return mainNets[0];
  }

  return null;
}

export function saveSelectedNetwork(name: string) {
  localStorage.setItem("LAST_SELECTED", name);
}
export function removeSelectedNetwork() {
  localStorage.removeItem("LAST_SELECTED");
}
