
export function getMainNetworks() {
    return [
        {
            chainId: "cosmoshub-4",
            displayName: "Cosmos Hub",
            showAirdrop: false,
            src: "https://www.mintscan.io/_next/static/image/assets/header/token_cosmos.a0bcdc826e90453483f279070ca2fb36.svg",
            experimental: false,
            testnet: false,
            lcd: "https://cosmos.api.ping.pub",
            rpc: "https://rpc-cosmoshub.blockapsis.com:443",
            txHashEndpoint: 'https://www.mintscan.io/cosmos/txs/',

            currencies: [
                {
                    coinDenom: 'ATOM',
                    coinMinimalDenom: 'uatom',
                    coinDecimals: 6,
                },
            ],
            config: {
                gasPriceStep: { low: 0.01, average: 0.025, high: 0.03 }
            }
        },
        {
            chainId: "osmosis-1",
            displayName: "Osmosis",
            showAirdrop: false,
            src: "https://www.mintscan.io/_next/static/image/assets/header/token_osmosis.4ea84e0bafc2ce3c619fc5c2290d6c29.svg",
            experimental: false,
            testnet: false,
            lcd: "https://osmo.api.ping.pub",
            rpc: "https://osmosis.validator.network",
            txHashEndpoint: 'https://www.mintscan.io/osmosis/txs/',
            currencies: [
                {
                    coinDenom: 'OSMO',
                    coinMinimalDenom: 'uosmo',
                    coinDecimals: 6,
                },
            ],
            config: {
                gasPriceStep: { low: 0.01, average: 0.025, high: 0.03 }
            }
        }
    ]

}

export function getTestNetworks() {
    return [
        // {
        //     chainId: "testnet",
        //     displayName: "Simapp",
        //     experimental: true,
        //     src: "https://www.mintscan.io/_next/static/image/assets/header/token_cosmos.a0bcdc826e90453483f279070ca2fb36.svg",
        //     testnet: true,
        //     lcd: 'http://localhost:1317',
        //     rpc: 'http://localhost:26657',
        //     txHashEndpoint: 'https://www.mintscan.io/simapp/txs/',
        //     currencies: [
        //         {
        //             coinDenom: 'STAKE',
        //             coinMinimalDenom: 'stake',
        //             coinDecimals: 6,
        //         },
        //     ],
        //     config: {
        //         chainId: "testnet",
        //         chainName: "Simapp",
        //         rpc: 'http://localhost:26657',
        //         rest: 'http://localhost:1317',
        //         stakeCurrency: {
        //             coinDenom: 'STAKE',
        //             coinMinimalDenom: 'stake',
        //             coinDecimals: 6,
        //             coinGeckoId: 'simapp',
        //         },
        //         bip44: {
        //             coinType: 118,
        //         },
        //         bech32Config: {
        //             bech32PrefixAccAddr: `cosmos`,
        //             bech32PrefixAccPub: `cosmospub`,
        //             bech32PrefixValAddr: `cosmosvaloper`,
        //             bech32PrefixValPub: `cosmosvaloperpub`,
        //             bech32PrefixConsAddr: `cosmosvalcons`,
        //             bech32PrefixConsPub: `cosmosvalconspub`,
        //         },
        //         currencies: [
        //             {
        //                 coinDenom: 'STAKE',
        //                 coinMinimalDenom: 'stake',
        //                 coinDecimals: 6,
        //                 coinGeckoId: 'simapp',
        //             },
        //         ],
        //         feeCurrencies: [
        //             {
        //                 coinDenom: 'STAKE',
        //                 coinMinimalDenom: 'stake',
        //                 coinDecimals: 6,
        //                 coinGeckoId: 'simapp',
        //             },
        //         ],
        //         coinType: 118,
        //         gasPriceStep: {
        //             low: 0.00,
        //             average: 0.0025,
        //             high: 0.004,
        //         },
        //         walletUrlForStaking: 'http://localhost:1317/stake',
        //     }
        // },
        {
            chainId: "passage-testnet-1",
            displayName: "Passage-Testnet",
            experimental: true,
            showAirdrop: true,
            src: "https://www.mintscan.io/_next/static/image/assets/header/token_cosmos.a0bcdc826e90453483f279070ca2fb36.svg",
            testnet: true,
            lcd: 'https://api.passage3d.vitwit.com/',
            rpc: 'https://rpc.passage3d.vitwit.com',
            txHashEndpoint: 'https://www.mintscan.io/passage/txs/',
            currencies: [
                {
                    coinDenom: 'PASG',
                    coinMinimalDenom: 'upasg',
                    coinDecimals: 6,
                },
            ],
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
                    average: 0.0025,
                    high: 0.004,
                },
                walletUrlForStaking: 'http://localhost:1317/stake',
            }
        }
    ]
}

export function getSelectedNetwork() {
    let name = localStorage.getItem('LAST_SELECTED')
    let mainNets = getMainNetworks()

    if (name != null) {
        for (let i = 0; i < mainNets.length; i++) {
            if (mainNets[i].displayName === name) {
                return mainNets[i]
            }
        }
    }

    let testNets = getTestNetworks()
    if (name != null) {
        for (let i = 0; i < testNets.length; i++) {
            if (testNets[i].displayName === name) {
                return testNets[i]
            }
        }
    }

    saveSelectedNetwork(testNets[0].displayName)
    return mainNets.length > 0 ? testNets[0] : null
}


export function saveSelectedNetwork(name) {
    localStorage.setItem('LAST_SELECTED', name)
}