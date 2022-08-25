type Currency = {
  coinDenom: string;
  coinMinimalDenom: string;
  coinDecimals: number;
  coinGeckoId?: string;
};

type Logos = { toolbar: string; menu: string };

type StakeCurrency = {
  coinDenom: string;
  coinMinimalDenom: string;
  coinDecimals: number;
  coinGeckoId?: string;
};

type BIP44 = { coinType: number };

type GasPrice = { low: number; average: number; high: number };

type Bech32Config = {
  bech32PrefixAccAddr: string;
  bech32PrefixAccPub: string;
  bech32PrefixValAddr: string;
  bech32PrefixValPub: string;
  bech32PrefixConsAddr: string;
  bech32PrefixConsPub: string;
};

interface NetworkConfig {
  chainId: string;
  chainName: string;
  rest: string;
  rpc: string;
  stakeCurrency?: StakeCurrency;
  bip44?: BIP44;
  bech32Config?: Bech32Config;
  currencies: Currency[];
  feeCurrencies?: Currency[];
  coinType?: number;
  gasPriceStep: GasPrice;
  walletUrlForStaking?: string;
}

interface AirdropAction {
  type: string;
  title: string;
  redirect?: string;
}

interface Network {
  showAirdrop: boolean;
  logos: Logos;
  experimental: boolean;
  isTestnet: boolean;
  explorerTxHashEndpoint: string;
  config: NetworkConfig;
  airdropMessage?: string;
  airdropActions?: AirdropAction[];
}

export function getMainNetworks(): Network[] {
  if (window.location.origin === "https://airdrop.passage3d.com") {
    return [
      {
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
        },
      },
      // {
      //   showAirdrop: false,
      //   logos: {
      //     menu: "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/cosmoshub/images/cosmoshub.svg",
      //     toolbar:
      //       "https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/cosmoshub/images/cosmoshub-logo.png",
      //   },
      //   experimental: false,
      //   isTestnet: false,
      //   explorerTxHashEndpoint: "https://www.mintscan.io/cosmos/txs/",
      //   config: {
      //     chainId: "cosmoshub-4",
      //     chainName: "Cosmos Hub",
      //     rest: "https://api-cosmoshub-ia.notional.ventures/",
      //     rpc: "https://rpc-cosmoshub.blockapsis.com",
      //     gasPriceStep: {
      //       low: 0.01,
      //       average: 0.025,
      //       high: 0.03,
      //     },
      //     currencies: [
      //       {
      //         coinDenom: "ATOM",
      //         coinMinimalDenom: "uatom",
      //         coinDecimals: 6,
      //       },
      //     ],
      //   },
      // },
    ];
  }
  return [
    {
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
        rest: "https://resolute.vitwit.com/cosmos_api",
        rpc: "https://resolute.vitwit.com/cosmos_rpc/",
        gasPriceStep: { low: 0.01, average: 0.025, high: 0.03 },
        currencies: [
          { coinDenom: "ATOM", coinMinimalDenom: "uatom", coinDecimals: 6 },
        ],
      },
    },
    {
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
      },
    },
    {
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
        rest: "https://resolute.vitwit.com/regen_api",
        rpc: "https://resolute.vitwit.com/regen_rpc/",
        gasPriceStep: { low: 0.015, average: 0.03, high: 0.04 },
        currencies: [
          { coinDenom: "REGEN", coinMinimalDenom: "uregen", coinDecimals: 6 },
        ],
      },
    },
    {
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
        rest: " https://resolute.vitwit.com/akash_api",
        rpc: "https://resolute.vitwit.com/akash_rpc/",
        gasPriceStep: { low: 0.015, average: 0.03, high: 0.04 },
        currencies: [
          { coinDenom: "AKT", coinMinimalDenom: "uakt", coinDecimals: 6 },
        ],
      },
    },
    {
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
        rest: "https://resolute.vitwit.com/osmosis_api",
        rpc: "https://resolute.vitwit.com/osmosis_rpc/",
        currencies: [
          { coinDenom: "OSMO", coinMinimalDenom: "uosmo", coinDecimals: 6 },
        ],
        gasPriceStep: { low: 0.01, average: 0.025, high: 0.03 },
      },
    },
    {
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
        rest: "https://resolute.vitwit.com/juno_api",
        rpc: "https://resolute.vitwit.com/juno_rpc/",
        currencies: [
          { coinDenom: "JUNO", coinMinimalDenom: "ujuno", coinDecimals: 6 },
        ],
        gasPriceStep: { low: 0.01, average: 0.025, high: 0.03 },
      },
    },
    {
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
        rest: "https://resolute.vitwit.com/stargaze_api",
        rpc: "https://resolute.vitwit.com/stargaze_rpc/",
        currencies: [
          { coinDenom: "STARS", coinMinimalDenom: "ustars", coinDecimals: 6 },
        ],
        gasPriceStep: { low: 0.01, average: 0.025, high: 0.03 },
      },
    },
  ];
}

export function getTestNetworks(): Network[] {
  if (window.location.origin === "http://localhost:3000") {
    return [
      {
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
        isTestnet: true,
        explorerTxHashEndpoint: "https://passage3d.testaneka.com/txs/",
        config: {
          chainId: "testnet",
          chainName: "Passage-Testnet",
          rest: "http://127.0.0.1:1317",
          rpc: "http://127.0.0.1:26657",
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
          walletUrlForStaking: "https://stake.vitwit.com/validators",
        },
      },
    ];
  }

  return [];
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
