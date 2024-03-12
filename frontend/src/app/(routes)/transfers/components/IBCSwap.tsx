import { InputAdornment, TextField } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { swapTextFieldStyles } from '../styles';
import SourceChains from './SourceChains';
import AssetsList from './AssetsList';
import useGetChains from '@/custom-hooks/useGetChains';
import useGetAssets from '@/custom-hooks/useGetAssets';
import useChain from '@/custom-hooks/useChain';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { getBalances } from '@/store/features/bank/bankSlice';
import useAccount from '@/custom-hooks/useAccount';
import useSwaps from '@/custom-hooks/useSwaps';
import {
  setAmountIn,
  setAmountOut,
  setDestAsset,
  setDestChain,
  setSourceAsset,
  setSourceChain,
} from '@/store/features/swaps/swapsSlice';

const IBCSwap = () => {
  const { chainsInfo, loading: chainsLoading } = useGetChains();
  const { getChainAPIs } = useChain();
  const { getSwapRoute, routeLoading } = useSwaps();
  const { getAccountAddress, getAvailableBalance } = useAccount();
  const {
    assetsInfo,
    chainWiseAssetOptions,
    loading: assetsLoading,
  } = useGetAssets();
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

  const [selectedSourceChainAssets, setSelectedSourceChainAssets] = useState<
    AssetConfig[]
  >([]);
  const [selectDestChainAssets, setSelectedDestChainAssets] = useState<
    AssetConfig[]
  >([]);
  const [availableBalance, setAvailableBalance] = useState({
    amount: 0,
    minimalDenom: '',
    displayDenom: '',
    decimals: 0,
    parsedAmount: 0,
  });
  const [userInputChange, setUserInputChange] = useState(true);

  const handleSelectSourceChain = async (option: ChainConfig | null) => {
    dispatch(setSourceChain(option));
    const assets = option ? chainWiseAssetOptions[option?.chainID] : [];
    setSelectedSourceChainAssets(assets || []);
    dispatch(setSourceAsset(null));
    dispatch(setAmountIn(''));
    dispatch(setAmountOut(''));
    setAvailableBalance({
      amount: 0,
      minimalDenom: '',
      displayDenom: '',
      decimals: 0,
      parsedAmount: 0,
    });
    const { apis } = getChainAPIs(option?.chainID || '');
    const { address } = await getAccountAddress(option?.chainID || '');
    dispatch(
      getBalances({
        address: address,
        baseURL: apis[0],
        baseURLs: apis,
        chainID: option?.chainID || '',
      })
    );
  };

  const handleSelectSourceAsset = (option: AssetConfig | null) => {
    dispatch(setSourceAsset(option));
    const { balanceInfo } = getAvailableBalance({
      chainID: selectedSourceChain?.chainID || '',
      denom: option?.label || '',
    });
    setAvailableBalance(balanceInfo);
    dispatch(setAmountIn(''));
    dispatch(setAmountOut(''));
  };

  const handleSelectDestChain = (option: ChainConfig | null) => {
    dispatch(setDestChain(option));
    const assets = option ? chainWiseAssetOptions[option?.chainID] : [];
    setSelectedDestChainAssets(assets || []);
    dispatch(setDestAsset(null));
    dispatch(setAmountOut(''));
  };

  const handleSelectDestAsset = (option: AssetConfig | null) => {
    dispatch(setDestAsset(option));
    dispatch(setAmountOut(''));
  };

  const flipChains = () => {
    const tempSelectedSourceChain = selectedSourceChain;
    dispatch(setSourceChain(selectedDestChain));
    dispatch(setDestChain(tempSelectedSourceChain));

    const tempSelectedSourceAsset = selectedSourceAsset;
    dispatch(setSourceAsset(selectedDestAsset));
    dispatch(setDestAsset(tempSelectedSourceAsset));
    handleRotate();
  };

  const [isRotated, setIsRotated] = useState(false);

  const handleRotate = () => {
    setIsRotated((prev) => !prev);
  };

  useEffect(() => {
    if (
      !chainsLoading &&
      !assetsLoading &&
      !selectedSourceAsset &&
      selectedSourceChain
    ) {
      const assets = chainWiseAssetOptions[selectedSourceChain?.chainID] || [];
      setSelectedSourceChainAssets(assets);
    }
    if (
      !chainsLoading &&
      !assetsLoading &&
      !selectedDestAsset &&
      selectedDestChain
    ) {
      const assets = chainWiseAssetOptions[selectedDestChain?.chainID] || [];
      setSelectedDestChainAssets(assets);
    }
  }, [assetsLoading, chainsLoading]);

  const fetchSwapRoute = async (isAmountInput: boolean) => {
    const amount = isAmountInput ? amountIn : amountOut;
    const decimals = isAmountInput
      ? selectedSourceAsset?.decimals
      : selectedDestAsset?.decimals;
    const { isAmountIn, resAmount } = await getSwapRoute({
      amount: Number(amount) * 10 ** (decimals || 1),
      destChainID: selectedDestChain?.chainID || '',
      destDenom: selectedDestAsset?.denom || '',
      sourceChainID: selectedSourceChain?.chainID || '',
      sourceDenom: selectedSourceAsset?.label || '',
      isAmountIn: isAmountInput,
    });
    const resultDecimals = isAmountInput
      ? selectedDestAsset?.decimals
      : selectedSourceAsset?.decimals;
    const parsedDestAmount = parseFloat(
      (Number(resAmount) / 10.0 ** (resultDecimals || 1)).toFixed(6)
    );
    if (isAmountIn) {
      dispatch(setAmountOut(parsedDestAmount.toString()));
    } else {
      dispatch(setAmountIn(parsedDestAmount.toString()));
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

  const handleAmountOutChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const input = e.target.value;
    if (/^-?\d*\.?\d*$/.test(input)) {
      if ((input.match(/\./g) || []).length <= 1) {
        dispatch(setAmountOut(input));
        setUserInputChange(true);
      }
    }
  };

  useEffect(() => {
    if (userInputChange) {
      fetchSwapRoute(true);
      setUserInputChange(false);
    }
  }, [amountIn]);

  useEffect(() => {
    if (userInputChange) {
      fetchSwapRoute(false);
      setUserInputChange(false);
    }
  }, [amountOut]);

  useEffect(() => {
    if (selectedDestAsset) {
      fetchSwapRoute(true);
    } else {
      dispatch(setAmountOut(''));
    }
  }, [selectedDestAsset]);

  return (
    <div className="flex justify-center">
      <div className="bg-[#FFFFFF0D] rounded-2xl p-6 flex flex-col justify-between items-center gap-6 min-w-[550px]">
        <div className="bg-[#FFFFFF0D] rounded-2xl p-4 flex flex-col gap-4 w-full">
          <div className="text-[16px]">From</div>
          <div className="space-y-2">
            <div className="text-[14px] font-extralight">Select Asset</div>
            <div className="flex justify-between gap-4">
              <div className="flex-1">
                <SourceChains
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
                  assetsLoading={assetsLoading}
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="font-extralight text-[14px]">Enter Amount</div>
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
                      <div className="text-[14px] font-extralight text-white">
                        {availableBalance.parsedAmount || 0}
                      </div>
                      <div className="text-[14px] font-extralight text-[#FFFFFF80]">
                        {availableBalance.displayDenom || '-'}
                      </div>
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
          <div className="text-[16px]">To</div>
          <div className="space-y-2">
            <div className="text-[14px] font-extralight">Select Asset</div>
            <div className="flex justify-between gap-4">
              <div className="flex-1">
                <SourceChains
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
                  assetsLoading={assetsLoading}
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="font-extralight text-[14px]">You will receive</div>
            <TextField
              name="destAmount"
              className="rounded-lg bg-[#ffffff0D]"
              fullWidth
              required={false}
              size="small"
              autoFocus={true}
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
              onChange={handleAmountOutChange}
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
        </div>
        <div className="w-full">
          <button className="swap-btn primary-gradient">Swap</button>
        </div>
      </div>
    </div>
  );
};

export default IBCSwap;
