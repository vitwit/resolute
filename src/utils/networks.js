
export function getNetworks() {
    return [
        {
            chainId: "cosmoshub-4",
            displayName: "Cosmos Hub",
            experimental: false,
            lcd: "https://cosmos.api.ping.pub"
        },
        {
            chainId: "osmosis-1",
            displayName: "Osmosis",
            experimental: false,
            lcd: "https://osmo.api.ping.pub"
        },
        {
            chainId: "testnet",
            displayName: "Simapp",
            experimental: true,
            lcd: 'http://localhost:1317',
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
        }
    ]
    
}