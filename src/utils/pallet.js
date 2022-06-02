

const networks = {
    "Passage-Testnet": {
        primary: {
            light: '#6573c3',
            main: '#000',
            dark: '#2c387e',
            contrastText: '#fff',
        },
        secondary: {
            light: '#1de9b6',
            main: '#1de9b6',
            dark: '#14a37f',
            contrastText: '#000',
        },
    },
    "Cosmos Hub": {
        primary: {
            light: '#6573c3',
            main: '#3f51b5',
            dark: '#2c387e',
            contrastText: '#fff',
        },
        secondary: {
            light: '#1de9b6',
            main: '#1de9b6',
            dark: '#14a37f',
            contrastText: '#000',
        },
    },
    "Osmosis": {
        primary: {
            light: '#6573c3',
            main: '#3f51b5',
            dark: '#2c387e',
            contrastText: '#fff',
        },
        secondary: {
            light: '#1de9b6',
            main: '#1de9b6',
            dark: '#14a37f',
            contrastText: '#000',
        },
    }
}

const defaultPallet = {
    primary: {
        light: '#6573c3',
        main: '#3f51b5',
        dark: '#2c387e',
        contrastText: '#fff',
    },
    secondary: {
        light: '#1de9b6',
        main: '#1de9b6',
        dark: '#14a37f',
        contrastText: '#000',
    },
}

export function getPalletByNetwork(networkName) {
    if (networkName === "") return defaultPallet
    const pallet = networks[networkName]
    if (!pallet) return defaultPallet
    return pallet
}