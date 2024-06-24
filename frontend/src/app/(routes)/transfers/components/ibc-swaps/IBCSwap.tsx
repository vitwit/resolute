import {
  Avatar,
  Box,
  CircularProgress,
  TextField,
  Tooltip,
} from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
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
  setSlippage,
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
import { FLIP_ICON, ROUTE_ICON, SETTINGS_ICON } from '@/constants/image-names';
import { IBC_SWAP_GRADIENT, SWAP_ROUTE_ERROR } from '@/utils/constants';
import { customTextFieldStyles } from '../../styles';
import Settings from './Settings';

const emptyBalance = {
  amount: 0,
  minimalDenom: '',
  displayDenom: '',
  decimals: 0,
  parsedAmount: 0,
};

type HandleAmountChangeFunc = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => void;
type QuickSelectAmountFunc = (value: string) => void;

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
  const slippage = useAppSelector((state) => state.swaps.slippage);
  const allNetworks = useAppSelector((state) => state.common.allNetworksInfo);
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
  const [settingsOpen, setSettingsOpen] = useState(false);

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
        slippage: Number(slippage),
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
    if (/^\d*\.?\d*$/.test(input)) {
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

  const handleSlippageChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const input = e.target.value;
    if (/^\d*\.?\d*$/.test(input)) {
      if ((input.match(/\./g) || []).length <= 1) {
        dispatch(setSlippage(input));
        setUserInputChange(true);
      }
    }
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
    if (slippage) {
      fetchSwapRoute();
    }
  }, [slippage]);

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

  const quickSelectAmount = (value: string) => {
    if (availableBalance?.parsedAmount && availableBalance?.displayDenom) {
      const amount = availableBalance.parsedAmount;
      if (value === 'half') {
        let halfAmount = Math.max(0, amount || 0) / 2;
        halfAmount = +halfAmount.toFixed(6);
        dispatch(setAmountIn(halfAmount.toString()));
      } else {
        let maxAmount = Math.max(0, amount || 0);
        maxAmount = +maxAmount.toFixed(6);
        dispatch(setAmountIn(maxAmount.toString()));
      }
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
      return;
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
    <div className="flex justify-center p-6 w-[600px] bg-[#FFFFFF05] rounded-2xl">
      {settingsOpen ? (
        <Settings
          onClose={() => setSettingsOpen(false)}
          handleSlippageChange={handleSlippageChange}
        />
      ) : showRoute && swapRoute ? (
        <RoutePreview
          swapRoute={swapRoute}
          onClose={() => setShowRoute(false)}
        />
      ) : (
        <div className="flex flex-col justify-between items-center gap-4">
          <div className="flex flex-col justify-between items-center gap-6 w-full relative">
            <div className="space-y-4 w-full">
              <div className="flex items-center justify-between w-full">
                <div className="text-b1 text-[#ffffff80]">Swap</div>
                <div className="flex items-center gap-2">
                  {swapRoute ? (
                    <Tooltip title="View Route" placement="left">
                      <button onClick={() => setShowRoute(true)} type="button">
                        <Image
                          src={ROUTE_ICON}
                          height={24}
                          width={24}
                          alt="View Route"
                        />
                      </button>
                    </Tooltip>
                  ) : null}
                  <Tooltip title="Settings" placement="bottom">
                    <button type="button" onClick={() => setSettingsOpen(true)}>
                      <Image
                        src={SETTINGS_ICON}
                        height={24}
                        width={24}
                        alt="Settings"
                      />
                    </button>
                  </Tooltip>
                </div>
              </div>
              <div className="bg-[#FFFFFF05] rounded-2xl w-full">
                <Box
                  sx={{
                    background: selectedSourceChain
                      ? allNetworks?.[selectedSourceChain?.chainID]?.config
                          .theme.gradient || IBC_SWAP_GRADIENT
                      : IBC_SWAP_GRADIENT,
                    paddingY: '8px',
                    paddingX: '16px',
                    height: '72px',
                  }}
                  className="flex items-center justify-between rounded-t-2xl"
                >
                  {selectedSourceChain?.logoURI ? (
                    <Avatar
                      src={selectedSourceChain?.logoURI || ''}
                      sx={{ width: '40px', height: '40px' }}
                    />
                  ) : (
                    <div className="h-10 w-10"></div>
                  )}
                  {fromAddress ? (
                    <div className="bg-[#ffffff14] text-[14px] px-3 py-1 rounded-full font-light">
                      {shortenAddress(fromAddress, 20)}
                    </div>
                  ) : (
                    <button className="btn-small" onClick={connectSourceWallet}>
                      Connect
                    </button>
                  )}
                </Box>
                <div className="space-y-6 w-full p-4">
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
                  <div className="space-y-1">
                    <AmountInputWrapper
                      handleAmountChange={handleAmountInChange}
                      amount={amountIn}
                      quickSelectAmount={quickSelectAmount}
                    />
                    <div className="secondary-text !text-[12px] !font-light flex gap-1">
                      <div>Available Balance</div>
                      {balanceStatus === TxStatus.PENDING &&
                      !availableBalance.parsedAmount &&
                      !availableBalance.displayDenom ? (
                        <CircularProgress size={14} sx={{ color: 'white' }} />
                      ) : (
                        <>
                          <div>{availableBalance.parsedAmount || 0}</div>
                          <div>{availableBalance.displayDenom || null}</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              onClick={flipChains}
              className={`transition-transform transform cursor-pointer delay-400 ${isRotated ? 'rotate-180' : ''}`}
            >
              <Image src={FLIP_ICON} width={24} height={24} alt="Swap" />
            </div>
            <div className="bg-[#FFFFFF05] rounded-2xl w-full">
              <Box
                sx={{
                  background: selectedDestChain
                    ? allNetworks?.[selectedDestChain?.chainID]?.config.theme
                        .gradient || IBC_SWAP_GRADIENT
                    : IBC_SWAP_GRADIENT,
                  paddingY: '8px',
                  paddingX: '16px',
                  height: '72px',
                }}
                className="flex items-center justify-between rounded-t-2xl"
              >
                {selectedDestChain?.logoURI ? (
                  <Avatar
                    src={selectedDestChain?.logoURI || ''}
                    sx={{ width: '40px', height: '40px' }}
                  />
                ) : (
                  <div className="h-10 w-10"></div>
                )}
                {toAddress ? (
                  <div className="bg-[#ffffff14] text-[14px] px-3 py-1 rounded-full font-light">
                    {shortenAddress(toAddress, 20)}
                  </div>
                ) : (
                  <button className="btn-small" onClick={connectDestWallet}>
                    Connect
                  </button>
                )}
              </Box>
              <div
                className={`space-y-6 w-full p-4 ${routeLoading ? 'animate-pulse' : ''}`}
              >
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AmountInputField
                      amount={amountOut === '0' ? '' : amountOut}
                    />
                  </div>
                  <div
                    onClick={handleSendToAnotherAddress}
                    className="secondary-btn w-[250px] text-right"
                  >
                    {otherAddress
                      ? 'Receive on same wallet'
                      : 'Receive on another wallet'}
                  </div>
                </div>
                {otherAddress ? (
                  <div>
                    <TextField
                      name="toAddress"
                      className="bg-transparent rounded-full border-[1px] border-[#ffffff80] h-10"
                      fullWidth
                      required={false}
                      size="small"
                      autoFocus={true}
                      placeholder="Enter Address"
                      sx={customTextFieldStyles}
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
                ) : null}
                <div className="divider-line !bg-[#ffffff14]"></div>
                <div className="flex justify-between items-center w-full">
                  <div>
                    {routeLoading ? (
                      <div className="text-b1">
                        Fetching Route<span className="dots-flashing"></span>{' '}
                      </div>
                    ) : (
                      <div>
                        {routeError ? (
                          <div className="flex justify-between gap-1 text-b1">
                            <div className="text-red-300">{routeError}</div>
                            {routeError === SWAP_ROUTE_ERROR ? (
                              <div
                                onClick={fetchSwapRoute}
                                className="secondary-btn"
                              >
                                Retry
                              </div>
                            ) : null}
                          </div>
                        ) : (
                          <div>
                            {swapRoute &&
                            selectedSourceAsset &&
                            selectedDestAsset ? (
                              <div className="text-b1 text-[#ffffff80] flex items-center gap-[2px]">
                                <div>{amountIn}</div>
                                <div>{selectedSourceAsset?.symbol}</div>
                                <div>=</div>
                                <div>{amountOut}</div>
                                <div>{selectedDestAsset?.symbol}</div>
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div
                    onClick={() => setSettingsOpen(true)}
                    className="text-b1 flex items-center gap-[2px] cursor-pointer"
                  >
                    <div className="text-white underline underline-offset-[3px]">
                      {slippage || swapRoute?.params?.slippage}%
                    </div>
                    <div className="text-[#ffffff80] underline underline-offset-[3px]">
                      Slippage
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* {showRoute && swapRoute ? (
              <RoutePreview
                swapRoute={swapRoute}
                onClose={() => setShowRoute(false)}
              />
            ) : null} */}
          </div>
          <div className="w-full">
            <button
              className={`primary-btn w-full ${disableSwapBtn ? 'cursor-not-allowed' : 'cursor-pointer'}`}
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
      )}
    </div>
  );
};

export default IBCSwap;

const AmountInputWrapper = ({
  quickSelectAmount,
  handleAmountChange,
  amount,
}: {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  quickSelectAmount: QuickSelectAmountFunc;
  handleAmountChange: HandleAmountChangeFunc;
  amount: string;
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-10">
          <AmountInputField
            amount={amount}
            handleAmountChange={handleAmountChange}
          />
        </div>
        <div className="flex items-center gap-6">
          <QuickSetAmountButton
            value="half"
            quickSelectAmount={quickSelectAmount}
          />
          <QuickSetAmountButton
            value="max"
            quickSelectAmount={quickSelectAmount}
          />
        </div>
      </div>
    </div>
  );
};

const QuickSetAmountButton = ({
  value,
  quickSelectAmount,
}: {
  value: string;
  quickSelectAmount: QuickSelectAmountFunc;
}) => {
  return (
    <button
      onClick={() => quickSelectAmount(value)}
      type="button"
      className="btn-small capitalize"
    >
      {value}
    </button>
  );
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const AmountInputField = ({
  amount,
  handleAmountChange,
}: {
  amount: string;
  handleAmountChange?: HandleAmountChangeFunc;
}) => {
  return (
    <input
      className="amount-input-field !text-[28px]"
      onChange={handleAmountChange}
      value={amount}
      placeholder="0"
      required
    />
  );
};
