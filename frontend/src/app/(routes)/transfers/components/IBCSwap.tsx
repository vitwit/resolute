import { CircularProgress, InputAdornment, TextField } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { swapTextFieldStyles } from '../styles';
import AssetsList from './AssetsList';
import useGetChains from '@/custom-hooks/useGetChains';
import useGetAssets from '@/custom-hooks/useGetAssets';
import useChain from '@/custom-hooks/useChain';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { getBalances } from '@/store/features/bank/bankSlice';
import useAccount from '@/custom-hooks/useAccount';
import useSwaps from '@/custom-hooks/useSwaps';
import {
  resetTx,
  setAmountIn,
  setAmountOut,
  setDestAsset,
  setDestChain,
  setFromAddress,
  setSourceAsset,
  setSourceChain,
  setToAddress,
  txIBCSwap,
} from '@/store/features/swaps/swapsSlice';
import ChainsList from './ChainsList';
import { AssetConfig, ChainConfig } from '@/types/swaps';
import { TxStatus } from '@/types/enums';
import { RouteData } from '@0xsquid/sdk';
import { fromBech32 } from '@cosmjs/encoding';
import { shortenAddress } from '@/utils/util';
import { setError } from '@/store/features/common/commonSlice';
import RoutePreview from './RoutePreview';

const emptyBalance = {
  amount: 0,
  minimalDenom: '',
  displayDenom: '',
  decimals: 0,
  parsedAmount: 0,
};

const IBCSwap = () => {
  // To fetch all skip supported chains
  const { chainsInfo, loading: chainsLoading } = useGetChains();

  // To fetch all skip supported assets (chain - assets)
  const { getTokensByChainID, srcAssetsLoading, destAssetLoading } =
    useGetAssets();

  // To fetch 4 rest endpoints from chain-registry
  const { getChainEndpoints, getExplorerEndpoints } = useChain();

  const { getSwapRoute, routeLoading, routeError } = useSwaps();
  const { getAccountAddress, getAvailableBalance } = useAccount();
  const [otherAddress, setOtherAddress] = useState(false);
  const dispatch = useAppDispatch();
  const handleSendToAnotherAddress = () => {
    setOtherAddress((prev) => !prev);
  };

  const selectedSourceChain = useAppSelector(
    (state) => state.swaps.sourceChain
  );
  const selectedSourceAsset = useAppSelector(
    (state) => state.swaps.sourceAsset
  );
  const selectedDestChain = useAppSelector((state) => state.swaps.destChain);
  const selectedDestAsset = useAppSelector((state) => state.swaps.destAsset);
  const amountIn = useAppSelector((state) => state.swaps.amountIn);
  const amountOut = useAppSelector((state) => state.swaps.amountOut);
  const toAddress = useAppSelector((state) => state.swaps.toAddress);
  const fromAddress = useAppSelector((state) => state.swaps.fromAddress);
  const txStatus = useAppSelector((state) => state.swaps.txStatus.status);
  const sourceTxHash = useAppSelector((state) => state.swaps.txSuccess.txHash);

  const balanceStatus = useAppSelector(
    (state) => state.bank.balances?.[selectedSourceChain?.chainID || '']?.status
  );

  const [selectedSourceChainAssets, setSelectedSourceChainAssets] = useState<
    AssetConfig[]
  >([]);
  const [selectDestChainAssets, setSelectedDestChainAssets] = useState<
    AssetConfig[]
  >([]);
  const [availableBalance, setAvailableBalance] = useState(emptyBalance);
  const [userInputChange, setUserInputChange] = useState(true);
  const [receiverAddress, setReceiverAddress] = useState('');
  const [selfReceiverAddress, setSelfReceiverAddress] = useState('');
  const [swapRoute, setSwapRoute] = useState<RouteData | null>(null);
  const [addressValidationError, setAddressValidationError] = useState('');
  const [allInputsProvided, setAllInputsProvided] = useState(false);

  const handleSelectSourceChain = async (option: ChainConfig | null) => {
    dispatch(setFromAddress(''));
    dispatch(setSourceChain(option));

    setSelectedSourceChainAssets([]);
    dispatch(setSourceAsset(null));

    dispatch(setAmountIn(''));
    dispatch(setAmountOut(''));

    if (!option) {
      setAvailableBalance(emptyBalance);
    }

    if (option?.chainID) {
      const { address } = await getAccountAddress(option?.chainID || '');
      dispatch(setFromAddress(address));

      // Select assets based on chainID
      const assets = await getTokensByChainID(option?.chainID || '', true);
      setSelectedSourceChainAssets(assets || []);

      setAvailableBalance(emptyBalance);
      const { apis } = getChainEndpoints(option?.chainID || '');

      // To get all asset balances of address using selected chain
      if (address?.length) {
        dispatch(
          getBalances({
            address: address,
            baseURL: apis[0],
            baseURLs: apis,
            chainID: option?.chainID,
          })
        );
      }
    }
  };

  const handleSelectSourceAsset = async (option: AssetConfig | null) => {
    dispatch(setSourceAsset(option));
    dispatch(setAmountIn(''));
    dispatch(setAmountOut(''));
    if (option) {
      const { balanceInfo } = await getAvailableBalance({
        chainID: selectedSourceChain?.chainID || '',
        denom: option?.label || '',
      });
      setAvailableBalance(balanceInfo);
    } else {
      setAvailableBalance(emptyBalance);
    }
  };

  const handleSelectDestChain = async (option: ChainConfig | null) => {
    dispatch(setToAddress(''));
    dispatch(setDestAsset(null));
    dispatch(setAmountOut(''));
    dispatch(setDestChain(option));
    if (option?.chainID) {
      const { address } = await getAccountAddress(option.chainID);
      setSelfReceiverAddress(address);
      dispatch(setToAddress(address));
      const assets = await getTokensByChainID(option.chainID, false);
      setSelectedDestChainAssets(assets || []);
    } else {
      setSelectedDestChainAssets([]);
    }
  };

  const handleSelectDestAsset = (option: AssetConfig | null) => {
    dispatch(setDestAsset(option));
    dispatch(setAmountOut(''));
  };

  const flipChains = async () => {
    const tempSelectedSourceChain = selectedSourceChain;
    dispatch(setSourceChain(selectedDestChain));
    dispatch(setDestChain(tempSelectedSourceChain));

    const tempSelectedSourceAsset = selectedSourceAsset;
    dispatch(setSourceAsset(selectedDestAsset));
    dispatch(setDestAsset(tempSelectedSourceAsset));

    const tempFromAddress = fromAddress;
    dispatch(setFromAddress(toAddress));
    dispatch(setToAddress(tempFromAddress));

    handleRotate();
    if (selectedDestChain && selectedDestAsset) {
      const { apis } = getChainEndpoints(selectedDestChain?.chainID || '');
      const { address } = await getAccountAddress(
        selectedDestChain?.chainID || ''
      );
      dispatch(
        getBalances({
          address: address,
          baseURL: apis[0],
          baseURLs: apis,
          chainID: selectedDestChain?.chainID || '',
        })
      );

      const { balanceInfo } = await getAvailableBalance({
        chainID: selectedDestChain?.chainID || '',
        denom: selectedDestAsset?.label || '',
      });
      setAvailableBalance(balanceInfo);
    } else {
      setAvailableBalance(emptyBalance);
    }
  };

  const [isRotated, setIsRotated] = useState(false);
  const disableSwapBtn =
    txStatus === TxStatus.PENDING ||
    !allInputsProvided ||
    routeLoading ||
    !!routeError;

  const handleRotate = () => {
    setIsRotated((prev) => !prev);
  };

  const fetchSwapRoute = async () => {
    if (
      selectedDestAsset &&
      selectedDestChain &&
      selectedSourceAsset &&
      selectedSourceChain &&
      Number(amountIn)
    ) {
      const amount = amountIn;
      const decimals = selectedSourceAsset?.decimals;
      const { resAmount, route } = await getSwapRoute({
        amount: Number(amount) * 10 ** (decimals || 1),
        destChainID: selectedDestChain?.chainID || '',
        destDenom: selectedDestAsset?.denom || '',
        sourceChainID: selectedSourceChain?.chainID || '',
        sourceDenom: selectedSourceAsset?.denom || '',
        fromAddress: fromAddress,
        toAddress: toAddress,
      });
      setSwapRoute(route);
      const resultDecimals = selectedDestAsset?.decimals;
      const parsedDestAmount = parseFloat(
        (Number(resAmount) / 10.0 ** (resultDecimals || 1)).toFixed(6)
      );
      dispatch(setAmountOut(parsedDestAmount.toString()));
    } else if (!Number(amountIn)) {
      dispatch(setAmountOut('0'));
    }
  };

  const handleAmountInChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const input = e.target.value;
    if (/^-?\d*\.?\d*$/.test(input)) {
      if ((input.match(/\./g) || []).length <= 1) {
        dispatch(setAmountIn(input));
        setUserInputChange(true);
      }
    }
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    validateAddress(value);
    dispatch(setToAddress(value));
    setReceiverAddress(value);
  };

  const validateAddress = (address: string) => {
    if (address.length) {
      try {
        fromBech32(address);
        setAddressValidationError('');
        return true;
      } catch (error) {
        setAddressValidationError('Invalid recipient address');
        return false;
      }
    } else {
      setAddressValidationError('Please enter address');
      return false;
    }
  };

  useEffect(() => {
    if (userInputChange) {
      fetchSwapRoute();
      setUserInputChange(false);
    }
  }, [amountIn]);

  useEffect(() => {
    if (selectedDestAsset) {
      fetchSwapRoute();
    } else {
      dispatch(setAmountOut(''));
    }
  }, [selectedDestAsset]);

  useEffect(() => {
    if (receiverAddress && !addressValidationError) {
      fetchSwapRoute();
    }
  }, [toAddress]);

  const onTxSwap = async () => {
    if (otherAddress && addressValidationError) {
      dispatch(
        setError({
          message: addressValidationError,
          type: 'error',
        })
      );
      return;
    } else if (otherAddress && !receiverAddress.length) {
      dispatch(
        setError({
          message: 'Please enter the recipient address',
          type: 'error',
        })
      );
      return;
    }
    if (swapRoute && allInputsProvided) {
      const { rpcs, apis } = getChainEndpoints(
        selectedSourceChain?.chainID || ''
      );
      const { explorerEndpoint } = getExplorerEndpoints(
        selectedSourceChain?.chainID || ''
      );
      dispatch(
        txIBCSwap({
          rpcURLs: rpcs,
          signerAddress: fromAddress,
          sourceChainID: selectedSourceChain?.chainID || '',
          destChainID: selectedDestChain?.chainID || '',
          swapRoute: swapRoute,
          explorerEndpoint,
          baseURLs: apis,
        })
      );
    }
  };

  useEffect(() => {
    dispatch(resetTx());
  }, []);

  const validateAllInputs = () => {
    const chainsSelected = selectedSourceChain && selectedDestChain;
    const assetsSelected = selectedSourceAsset && selectedDestAsset;
    const srcAmount = Number(amountIn) ? true : false;
    const validReceiverAddress = !otherAddress
      ? true
      : receiverAddress && !addressValidationError
        ? true
        : false;

    if (chainsSelected && assetsSelected && srcAmount && validReceiverAddress) {
      setAllInputsProvided(true);
    }
    setAllInputsProvided(false);
  };

  const selectNetworkAlert = () => {
    dispatch(
      setError({
        message: 'Please select a network',
        type: 'error',
      })
    );
  };

  const connectSourceWallet = async () => {
    if (selectedSourceChain) {
      const { address } = await getAccountAddress(
        selectedSourceChain?.chainID || ''
      );
      dispatch(setFromAddress(address));
    } else {
      selectNetworkAlert();
    }
  };

  const connectDestWallet = async () => {
    if (selectedDestChain) {
      const { address } = await getAccountAddress(
        selectedDestChain?.chainID || ''
      );
      dispatch(setToAddress(address));
    } else {
      selectNetworkAlert();
    }
  };

  useEffect(() => {
    validateAllInputs();
  }, [
    selectedDestAsset,
    selectedDestChain,
    selectedSourceAsset,
    selectedSourceChain,
    amountIn,
  ]);

  useEffect(() => {
    if (!otherAddress) {
      dispatch(setToAddress(selfReceiverAddress));
      setReceiverAddress('');
      setAddressValidationError('');
    }
  }, [otherAddress]);

  useEffect(() => {
    if (!otherAddress && !addressValidationError) {
      fetchSwapRoute();
    }
  }, [otherAddress, toAddress]);

  useEffect(() => {
    if (sourceTxHash?.length && balanceStatus === TxStatus.IDLE) {
      const updateBalance = async () => {
        const { balanceInfo } = await getAvailableBalance({
          chainID: selectedSourceChain?.chainID || '',
          denom: selectedSourceAsset?.label || '',
        });
        setAvailableBalance(balanceInfo);
      };
      updateBalance();
    }
  }, [balanceStatus, sourceTxHash]);

  const [showRoute, setShowRoute] = useState(false);

  return (
    <div className="flex justify-center">
      <div className="bg-[#FFFFFF0D] rounded-2xl p-6 flex flex-col justify-between items-center gap-6 min-w-[550px]">
        <div className="flex flex-col justify-between items-center gap-6 w-full relative">
          <div className="bg-[#FFFFFF0D] rounded-2xl p-4 flex flex-col gap-4 w-full">
            <div className="flex justify-between items-center">
              <div className="text-[16px]">From</div>
              <div>
                {fromAddress ? (
                  <div className="bg-[#2E2B3E] text-[14px] px-3 py-1 rounded-full font-light">
                    {shortenAddress(fromAddress, 20)}
                  </div>
                ) : (
                  <button
                    className="primary-gradient text-[14px] rounded-full px-3 py-1"
                    onClick={connectSourceWallet}
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-[14px] font-extralight">Select Asset *</div>
              <div className="flex justify-between gap-4">
                <div className="flex-1">
                  <ChainsList
                    options={chainsInfo}
                    handleChange={handleSelectSourceChain}
                    selectedChain={selectedSourceChain}
                    dataLoading={chainsLoading}
                  />
                </div>
                <div className="flex-1">
                  <AssetsList
                    options={selectedSourceChainAssets}
                    handleChange={handleSelectSourceAsset}
                    selectedAsset={selectedSourceAsset}
                    assetsLoading={srcAssetsLoading}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="font-extralight text-[14px]">Enter Amount *</div>
              <TextField
                name="sourceAmount"
                className="rounded-lg bg-[#ffffff0D]"
                fullWidth
                required={false}
                size="small"
                autoFocus={true}
                placeholder="Enter Amount"
                sx={swapTextFieldStyles}
                value={amountIn}
                InputProps={{
                  sx: {
                    input: {
                      color: 'white !important',
                      fontSize: '14px',
                      padding: 2,
                    },
                  },
                  endAdornment: (
                    <InputAdornment position="start">
                      <div className="flex gap-1 font-int custom-font">
                        {balanceStatus === TxStatus.PENDING &&
                        !availableBalance.parsedAmount &&
                        !availableBalance.displayDenom ? (
                          <CircularProgress size={14} sx={{ color: 'white' }} />
                        ) : (
                          <>
                            <div className="text-[14px] font-extralight text-white">
                              {availableBalance.parsedAmount || 0}
                            </div>
                            <div className="text-[14px] font-extralight text-[#FFFFFF80]">
                              {availableBalance.displayDenom || '-'}
                            </div>
                          </>
                        )}
                      </div>
                    </InputAdornment>
                  ),
                }}
                onChange={handleAmountInChange}
              />
            </div>
          </div>
          <div
            onClick={flipChains}
            className={`transition-transform transform cursor-pointer delay-400 ${isRotated ? 'rotate-180' : ''}`}
          >
            <Image src="/ibc-swap-icon.svg" width={40} height={40} alt="Swap" />
          </div>
          <div className="bg-[#FFFFFF0D] rounded-2xl p-4 flex flex-col gap-4 w-full">
            <div className="flex justify-between items-center">
              <div className="text-[16px]">To</div>
              <div className={`${otherAddress ? 'invisible' : 'visible'}`}>
                {toAddress ? (
                  <div className="bg-[#2E2B3E] text-[14px] px-3 py-1 rounded-full font-light">
                    {shortenAddress(toAddress, 20)}
                  </div>
                ) : (
                  <button
                    className="primary-gradient text-[14px] rounded-full px-3 py-1"
                    onClick={connectDestWallet}
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-[14px] font-extralight">Select Asset *</div>
              <div className="flex justify-between gap-4">
                <div className="flex-1">
                  <ChainsList
                    options={chainsInfo}
                    handleChange={handleSelectDestChain}
                    selectedChain={selectedDestChain}
                    dataLoading={chainsLoading}
                  />
                </div>
                <div className="flex-1">
                  <AssetsList
                    options={selectDestChainAssets}
                    handleChange={handleSelectDestAsset}
                    selectedAsset={selectedDestAsset}
                    assetsLoading={destAssetLoading}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="font-extralight text-[14px] flex gap-2 items-center">
                <span>You will receive</span>
                {routeLoading ? (
                  <CircularProgress sx={{ color: 'white' }} size={12} />
                ) : null}
              </div>
              <TextField
                name="destAmount"
                className={`rounded-lg bg-[#ffffff0D] ${routeLoading ? 'animate-pulse' : ''}`}
                fullWidth
                required={false}
                size="small"
                disabled={true}
                placeholder="0"
                value={amountOut}
                sx={swapTextFieldStyles}
                InputProps={{
                  sx: {
                    input: {
                      color: 'white !important',
                      fontSize: '14px',
                      padding: 2,
                    },
                  },
                }}
              />
            </div>
            <div className="flex justify-end">
              <div
                onClick={handleSendToAnotherAddress}
                className="text-[14px] font-extralight underline underline-offset-[3px] cursor-pointer"
              >
                {otherAddress
                  ? 'Receive on same wallet'
                  : 'Receive on another wallet'}
              </div>
            </div>
            <div className={otherAddress ? `visible` : `invisible`}>
              <TextField
                name="toAddress"
                className="rounded-lg bg-[#ffffff0D]"
                fullWidth
                required={false}
                size="small"
                autoFocus={true}
                placeholder="Enter Address"
                sx={swapTextFieldStyles}
                value={receiverAddress}
                InputProps={{
                  sx: {
                    input: {
                      color: 'white !important',
                      fontSize: '14px',
                      padding: 2,
                    },
                  },
                }}
                onChange={handleAddressChange}
              />
            </div>
          </div>
          {showRoute && swapRoute ? (
            <RoutePreview
              swapRoute={swapRoute}
              onClose={() => setShowRoute(false)}
            />
          ) : null}
        </div>
        <div className="bg-[#FFFFFF0D] rounded-lg w-full py-2 px-4">
          {!allInputsProvided ? (
            'Please provide the required fields'
          ) : routeLoading ? (
            <div>
              Fetching route <span className="dots-flashing"></span>{' '}
            </div>
          ) : routeError ? (
            <div>{routeError}</div>
          ) : (
            <div>
              {!routeLoading && swapRoute ? (
                <div className="flex justify-between">
                  <div>Route found</div>
                  <div
                    className="underline font-light underline-offset-[3px] cursor-pointer"
                    onClick={() => setShowRoute((prev) => !prev)}
                  >
                    {showRoute ? 'Close' : 'View route'}
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
          )}
        </div>
        <div className="w-full">
          <button
            className={`swap-btn primary-gradient ${disableSwapBtn ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={onTxSwap}
            disabled={disableSwapBtn}
          >
            {txStatus === TxStatus.PENDING ? (
              <CircularProgress sx={{ color: 'white' }} size={16} />
            ) : (
              'Swap'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IBCSwap;
