import { TxStatus } from './enums';
import { RouteData } from '@0xsquid/sdk';
import { SigningStargateClient } from '@cosmjs/stargate';

interface ChainConfig {
  label: string;
  logoURI: string;
  chainID: string;
}

interface AssetConfig {
  label: string;
  symbol: string;
  logoURI: string;
  denom: string;
  decimals: number;
  name: string;
}

interface SwapState {
  sourceChain: ChainConfig | null;
  sourceAsset: AssetConfig | null;
  destChain: ChainConfig | null;
  destAsset: AssetConfig | null;
  amountIn: string;
  amountOut: string;
  toAddress: string;
  fromAddress: string;
  txStatus: {
    status: TxStatus;
    error: string;
  };
  txSuccess: {
    txHash: string;
  };
  txDestSuccess: {
    status: string;
    msg: string;
  };
  explorerEndpoint: string;
}

interface TxSwapInputs {
  rpcURLs: string[];
  swapRoute: RouteData;
  signerAddress: string;
  sourceChainID: string;
  destChainID: string;
  explorerEndpoint: string;
  baseURLs: string[];
}

interface TxSwapServiceInputs {
  signer: SigningStargateClient;
  route: RouteData;
  signerAddress: string;
}

interface SwapPathObject {
  type: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  value: any;
}
