import { InputAdornment, TextField } from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';
import { swapTextFieldStyles } from '../styles';
import SourceChains from './SourceChains';
import AssetsList from './AssetsList';
import useGetChains from '@/custom-hooks/useGetChain';
import useGetAssets from '@/custom-hooks/useGetAssets';

const IBCSwap = () => {
  const { chainsInfo } = useGetChains();
  const { assetsInfo, chainWiseAssetOptions } = useGetAssets();
  const [otherAddress, setOtherAddress] = useState(false);
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
  const [selectSourceChainAssets, setSelectedSourceChainAssets] = useState<
    AssetConfig[]
  >([]);
  const [selectDestChainAssets, setSelectedDestChainAssets] = useState<
    AssetConfig[]
  >([]);

  const handleSelectSourceChain = (option: ChainConfig | null) => {
    setSelectedSourceChain(option);
    const assets = option ? chainWiseAssetOptions[option?.chainID] : [];
    setSelectedSourceChainAssets(assets || []);
    setSelectedSourceAsset(null);
  };
  const handleSelectSourceAsset = (option: AssetConfig | null) => {
    setSelectedSourceAsset(option);
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
                />
              </div>
              <div className="flex-1">
                <AssetsList
                  options={selectSourceChainAssets}
                  handleChange={handleSelectSourceAsset}
                  selectedAsset={selectedSourceAsset}
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
                        {'12.323'}
                      </div>
                      <div className="text-[14px] font-extralight text-[#FFFFFF80]">
                        {'ATOM'}
                      </div>
                    </div>
                  </InputAdornment>
                ),
              }}
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
                />
              </div>
              <div className="flex-1">
                <AssetsList
                  options={selectDestChainAssets}
                  handleChange={handleSelectDestAsset}
                  selectedAsset={selectedDestAsset}
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
