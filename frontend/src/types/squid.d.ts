



interface NativeCurrency {
    name: string;
    symbol: string;
    decimals: number;
    icon: string;
}

interface ChainNativeContracts {
    wrappedNativeToken: string;
    ensRegistry: string;
    multicall: string;
    usdcToken: string;
}

interface Bridges {
    axelar: {
        gateway: string;
    };
    cctp: {
        cctpDomain: number;
        tokenMessenger: string;
    };
}

interface SquidContracts {
    squidRouter: string;
    defaultCrosschainToken: string;
    squidMulticall: string;
    squidFeeCollector: string;
}

interface Compliance {
    trmIdentifier: string;
}

interface ChainData {
    axelarChainName: string;
    networkIdentifier: string;
    chainType: string;
    rpc: string;
    networkName: string;
    chainId: string;
    nativeCurrency: NativeCurrency;
    swapAmountForGas: string;
    sameChainSwapsSupported: boolean;
    chainIconURI: string;
    blockExplorerUrls: string[];
    chainNativeContracts: ChainNativeContracts;
    bridges: Bridges;
    squidContracts: SquidContracts;
    compliance: Compliance;
    estimatedRouteDuration: number;
    estimatedBoostRouteDuration: number;
    enableBoostByDefault: boolean;
}

