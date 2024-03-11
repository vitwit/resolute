import { InputAdornment, TextField } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { swapTextFieldStyles } from '../styles';
import SourceChains from './SourceChains';
import AssetsList from './AssetsList';
import useGetChains from '@/custom-hooks/useGetChains';
import useGetAssets from '@/custom-hooks/useGetAssets';
import useChain from '@/custom-hooks/useChain';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { getBalances } from '@/store/features/bank/bankSlice';
import useAccount from '@/custom-hooks/useAccount';
import useSwaps from '@/custom-hooks/useSwaps';

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
  const [amountIn, setAmountIn] = useState('');
  const [amountOut, setAmountOut] = useState('');
  // const [routeLoading, setRouteLoading] = useState(false);
  const dispatch = useAppDispatch();
  const handleSendToAnotherAddress = () => {
    setOtherAddress((prev) => !prev);
  };
  const [selectedSourceChain, setSelectedSourceChain] =
    useState<ChainConfig | null>(null);
  const [selectedSourceAsset, setSelectedSourceAsset] =
    useState<AssetConfig | null>(null);
  const [selectedDestChain, setSelectedDestChain] =
    useState<ChainConfig | null>(null);
  const [selectedDestAsset, setSelectedDestAsset] =
    useState<AssetConfig | null>(null);
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

  const handleSelectSourceChain = async (option: ChainConfig | null) => {
    setSelectedSourceChain(option);
    const assets = option ? chainWiseAssetOptions[option?.chainID] : [];
    setSelectedSourceChainAssets(assets || []);
    setSelectedSourceAsset(null);
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
    setSelectedSourceAsset(option);
    const { balanceInfo } = getAvailableBalance({
      chainID: selectedSourceChain?.chainID || '',
      denom: option?.label || '',
      chainName: selectedSourceChain?.label.toLowerCase() || '',
    });
    setAvailableBalance(balanceInfo);
  };

  const handleSelectDestChain = (option: ChainConfig | null) => {
    setSelectedDestChain(option);
    const assets = option ? chainWiseAssetOptions[option?.chainID] : [];
    setSelectedDestChainAssets(assets || []);
    setSelectedDestAsset(null);
  };

  const handleSelectDestAsset = (option: AssetConfig | null) => {
    setSelectedDestAsset(option);
  };

  const flipChains = () => {
    const tempSelectedSourceChain = selectedSourceChain;
    setSelectedSourceChain(selectedDestChain);
    setSelectedDestChain(tempSelectedSourceChain);

    const tempSelectedSourceAsset = selectedSourceAsset;
    setSelectedSourceAsset(selectedDestAsset);
    setSelectedDestAsset(tempSelectedSourceAsset);
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

  const fetchSwapRoute = async (amount: string, isAmountIn: boolean) => {
    const { amountOut: destAmount } = await getSwapRoute({
      amountIn: Number(amount) * 10 ** availableBalance.decimals,
      destChainID: selectedDestChain?.chainID || '',
      destDenom: selectedDestAsset?.label || '',
      sourceChainID: selectedSourceChain?.chainID || '',
      sourceDenom: selectedSourceAsset?.label || '',
    });
    const parsedDestAmount = parseFloat(
      (Number(destAmount) / 10.0 ** 6).toFixed(6)
    );
    setAmountOut(parsedDestAmount.toString());
  };

  const handleAmountInChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const input = e.target.value;
    if (/^-?\d*\.?\d*$/.test(input)) {
      if ((input.match(/\./g) || []).length <= 1) {
        setAmountIn(input);
        fetchSwapRoute(input, true);
      }
    }
  };

  return (
    <div className="flex justify-center">
      <div className="bg-[#FFFFFF0D] rounded-2xl p-6 flex flex-col justify-between items-center gap-6 min-w-[550px]">
        <div className="bg-[#FFFFFF0D] rounded-2xl p-4 flex flex-col gap-4 w-full">
          <div className="text-[16px]">From</div>
          <div>{JSON.stringify(routeLoading)}</div>
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
