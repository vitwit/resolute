import { RouteResponse } from '@skip-router/core';
import { TxStatus } from './enums';

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
}

interface SwapState {
  sourceChain: ChainConfig | null;
  sourceAsset: AssetConfig | null;
  destChain: ChainConfig | null;
  destAsset: AssetConfig | null;
  amountIn: string;
  amountOut: string;
  txStatus: {
    status: TxStatus;
    error: string;
  };
  txSuccess: {
    txHash: string;
  };
  txDestSuccess: {
    status: string;
  };
}

interface TxSwapInputs {
  route: RouteResponse;
  userAddresses: Record<string, string>;
}

interface TxSwapServiceInputs extends TxSwapInputs {
  onSourceChainTxSuccess: (chainID: string, txHash: string) => void;
  onDestChainTxSuccess: (chainID: string, txHash: string) => void;
}
