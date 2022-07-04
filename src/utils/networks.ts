type Currency = {
    coinDenom: string,
    coinMinimalDenom: string,
    coinDecimals: number,
    coinGeckoId?: string,
}

type Logos = {
    toolbar: string,
    menu: string,
}

type StakeCurrency = {
    coinDenom: string,
    coinMinimalDenom: string,
    coinDecimals: number,
    coinGeckoId?: string,
}

type BIP44 = {
    coinType: number,
}

type GasPrice = {
    low: number,
    average: number,
    high: number
}

type Bech32Config = {
    bech32PrefixAccAddr: string,
    bech32PrefixAccPub: string,
    bech32PrefixValAddr: string,
    bech32PrefixValPub: string,
    bech32PrefixConsAddr: string,
    bech32PrefixConsPub: string,
}

interface NetworkConfig {
    chainId: string,
    chainName: string,
    rest: string,
    rpc: string,
    stakeCurrency?: StakeCurrency,
    bip44?: BIP44,
    bech32Config?: Bech32Config,
    currencies: Currency[],
    feeCurrencies?: Currency[],
    coinType?: number,
    gasPriceStep: GasPrice,
    walletUrlForStaking?: string,
}

interface AirdropAction {
    type: string,
    title: string,
    redirect?: string,
}

interface Network {
    showAirdrop: boolean,
    logos: Logos,
    experimental: boolean,
    isTestnet: boolean,
    explorerTxHashEndpoint: string,
    config: NetworkConfig,
    airdropMessage?: string,
    airdropActions?: AirdropAction[]
}
export function getMainNetworks(): Network[] {
    if (window.location.origin === 'https://airdrop.passage3d.com') {
        return [
            {
                showAirdrop: false,
                logos: {
                    menu: "https://www.mintscan.io/_next/static/image/assets/header/token_cosmos.a0bcdc826e90453483f279070ca2fb36.svg",
                    toolbar: "white-logo.png",
                },
                experimental: false,
                isTestnet: false,
                explorerTxHashEndpoint: 'https://www.mintscan.io/cosmos/txs/',
                config: {
                    chainId: "cosmoshub-4",
                    chainName: "Cosmos Hub",
                    rest: "https://api-cosmoshub-ia.notional.ventures/",
                    rpc: "https://rpc-cosmoshub.blockapsis.com",
                    gasPriceStep: { low: 0.01, average: 0.025, high: 0.03 },
                    currencies: [
                        {
                            coinDenom: 'ATOM',
                            coinMinimalDenom: 'uatom',
                            coinDecimals: 6,
                        },
                    ]
                }
            },
        ]
    }

    return [
        {
            showAirdrop: false,
            logos: {
                menu: "https://www.mintscan.io/_next/static/image/assets/header/token_cosmos.a0bcdc826e90453483f279070ca2fb36.svg",
                toolbar: "white-logo.png",
            },
            experimental: false,
            isTestnet: false,
            explorerTxHashEndpoint: 'https://www.mintscan.io/cosmos/txs/',
            config: {
                chainId: "cosmoshub-4",
                chainName: "Cosmos Hub",
                rest: "https://api-cosmoshub-ia.notional.ventures/",
                rpc: "https://rpc-cosmoshub.blockapsis.com",
                gasPriceStep: { low: 0.01, average: 0.025, high: 0.03 },
                currencies: [
                    {
                        coinDenom: 'ATOM',
                        coinMinimalDenom: 'uatom',
                        coinDecimals: 6,
                    },
                ]
            }
        },
        {
            showAirdrop: false,
            logos: {
                toolbar: "regen-network.png",
                menu: "https://www.mintscan.io/_next/static/image/assets/header/token_regen.7637b0ebe1330c92b57c48fb5817cfff.svg",
            },
            experimental: false,
            isTestnet: false,
            explorerTxHashEndpoint: 'https://www.mintscan.io/regen/txs/',
            config: {
                chainId: "regen-1",
                chainName: "Regen",
                rest: "https://regen.api.ping.pub",
                rpc: "http://rpc.regen.forbole.com:80",
                gasPriceStep: { low: 0.015, average: 0.03, high: 0.04 },
                currencies: [
                    {
                        coinDenom: 'REGEN',
                        coinMinimalDenom: 'uregen',
                        coinDecimals: 6,
                    },
                ],
            }
        },
        {

            showAirdrop: false,
            logos: {
                toolbar: "akash-logo.svg",
                menu: "https://www.mintscan.io/_next/static/image/assets/header/token_akash.88ea4dceb678639c79ad5afed4a61efd.svg",
            },
            experimental: false,
            isTestnet: false,
            explorerTxHashEndpoint: 'https://www.mintscan.io/akash/txs/',
            config: {
                chainId: "akashnet-2",
                chainName: "Akash",
                rest: "https://akash.c29r3.xyz/api",
                rpc: "https://rpc.akash.forbole.com:443",
                gasPriceStep: { low: 0.015, average: 0.03, high: 0.04 },
                currencies: [
                    {
                        coinDenom: 'AKT',
                        coinMinimalDenom: 'uakt',
                        coinDecimals: 6,
                    },
                ],
            },
        },
        {
            logos: {
                toolbar: "white-logo.png",
                menu: "https://www.mintscan.io/_next/static/image/assets/header/token_osmosis.4ea84e0bafc2ce3c619fc5c2290d6c29.svg",
            },
            showAirdrop: false,
            experimental: false,
            isTestnet: false,
            explorerTxHashEndpoint: 'https://www.mintscan.io/osmosis/txs/',
            config: {
                chainId: "osmosis-1",
                chainName: "Osmosis",
                rest: "https://osmo.api.ping.pub",
                rpc: "https://rpc-osmosis.blockapsis.com",
                currencies: [
                    {
                        coinDenom: 'OSMO',
                        coinMinimalDenom: 'uosmo',
                        coinDecimals: 6,
                    },
                ],
                gasPriceStep: { low: 0.01, average: 0.025, high: 0.03 }
            }
        }
    ]
}

export function getTestNetworks(): Network[] {
    return [
        {
            experimental: true,
            showAirdrop: true,
            airdropActions: [
                {
                    title: "#1 Initial Claim",
                    type: "action",

                },
                {
                    title: "#2 Stake",
                    type: "redirect",
                    redirect: "/validators",
                },
                {
                    title: "#3 Vote on Proposal",
                    type: "redirect",
                    redirect: "/proposals",
                }
            ],
            logos: {
                menu: "https://www.mintscan.io/_next/static/image/assets/header/token_cosmos.a0bcdc826e90453483f279070ca2fb36.svg",
                toolbar: "white-logo.png",
            },
            isTestnet: true,
            explorerTxHashEndpoint: 'https://www.mintscan.io/simapp/txs/',
            config: {
                chainId: "testnet",
                chainName: "Simapp",
                rpc: 'http://localhost:26657',
                rest: 'http://localhost:1317',
                stakeCurrency: {
                    coinDenom: 'STAKE',
                    coinMinimalDenom: 'stake',
                    coinDecimals: 6,
                    coinGeckoId: 'simapp',
                },
                bip44: {
                    coinType: 118,
                },
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
                        coinDenom: 'STAKE',
                        coinMinimalDenom: 'stake',
                        coinDecimals: 6,
                        coinGeckoId: 'simapp',
                    },
                ],
                feeCurrencies: [
                    {
                        coinDenom: 'STAKE',
                        coinMinimalDenom: 'stake',
                        coinDecimals: 6,
                        coinGeckoId: 'simapp',
                    },
                ],
                coinType: 118,
                gasPriceStep: {
                    low: 0.00,
                    average: 0.0025,
                    high: 0.004,
                },
                walletUrlForStaking: 'http://localhost:1317/stake',
            }
        },
        {
            experimental: true,
            showAirdrop: true,
            airdropActions: [
                {
                    title: "#1 Initial Claim",
                    type: "action",

                },
            ],
            airdropMessage: "Additional bonus will be credited if staked 50% of airdrop for 14+ months.",
            logos: {
                toolbar: "passage3d.png",
                menu: "./passage-logo-only.png",
            },
            isTestnet: true,
            explorerTxHashEndpoint: 'https://passage3d.testaneka.com/txs/',
            config: {
                chainId: "passage-testnet-1",
                chainName: "Passage-Testnet",
                rest: 'https://api.passage3d.vitwit.com/',
                rpc: 'https://rpc.passage3d.vitwit.com',
                stakeCurrency: {
                    coinDenom: 'PASG',
                    coinMinimalDenom: 'upasg',
                    coinDecimals: 6,
                    coinGeckoId: 'passage3d',
                },
                bip44: {
                    coinType: 118,
                },
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
                        coinDenom: 'PASG',
                        coinMinimalDenom: 'upasg',
                        coinDecimals: 6,
                        coinGeckoId: 'passage',
                    },
                ],
                feeCurrencies: [
                    {
                        coinDenom: 'PASG',
                        coinMinimalDenom: 'upasg',
                        coinDecimals: 6,
                        coinGeckoId: 'passage',
                    },
                ],
                coinType: 118,
                gasPriceStep: {
                    low: 0.00,
                    average: 0.00,
                    high: 0.00,
                },
                walletUrlForStaking: 'https://stake.vitwit.com/validators',
            }
        }
    ]
}

export function getSelectedNetwork(): Network | null {
    let name = localStorage.getItem('LAST_SELECTED')
    let mainNets = getMainNetworks()
    if (name != null) {
        for (let i = 0; i < mainNets.length; i++) {
            if (mainNets[i].config.chainName === name) {
                saveSelectedNetwork(mainNets[i].config.chainName)
                return mainNets[i]
            }
        }
    }

    let testNets = getTestNetworks()
    if (name != null) {
        for (let i = 0; i < testNets.length; i++) {
            if (testNets[i].config.chainName === name) {
                saveSelectedNetwork(testNets[i].config.chainName)
                return testNets[i]
            }
        }
    }

    // return passage network if provided network is not present
    if (testNets.length > 0) {
        saveSelectedNetwork(testNets[0].config.chainName)
        return testNets[0]
    }

    if (mainNets.length > 0) {
        saveSelectedNetwork(mainNets[0].config.chainName)
        return mainNets[0]
    }

    return null
}


export function saveSelectedNetwork(name: string) {
    localStorage.setItem('LAST_SELECTED', name)
}

export function removeSelectedNetwork() {
    localStorage.removeItem('LAST_SELECTED')
}


