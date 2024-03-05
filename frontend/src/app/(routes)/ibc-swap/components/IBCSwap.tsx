import React, { useEffect, useState } from 'react';
import { createSkipRouterClient } from '@/store/features/ibc/ibcService';
import useGetChains from '@/custom-hooks/useGetChains';
import { MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { Chain } from '@/types/swaps';
import { multiSelectDropDownStyle } from '../../authz/styles';
import useGetAssets from '@/custom-hooks/useGetAssets';
import { Asset, RouteResponse } from '@skip-router/core';
import { Josefin_Sans } from 'next/font/google';
import useGetSwapRoute from '@/custom-hooks/useGetSwapRoute';
import { customMUITextFieldStyles } from '@/utils/commonStyles';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';

declare let window: WalletWindow;

const getDecimals = (assets: Asset[], chainID: string) => {
  const asset = assets.filter((asset) => asset.originChainID === chainID) || [];
  console.log('=====');
  console.log(asset);
  return asset[0].decimals || 0;
};

const IBCSwap = () => {
  const chainsInfo = useGetChains();
  const assetsInfo = useGetAssets();
  const { getFee } = useGetChainInfo();

  const [fromChain, setFromChain] = useState<string>('');
  const [toChain, setToChain] = useState<string>('');
  const [fromChainAssets, setFromChainAssets] = useState<Asset[]>();
  const [toChainAssets, setToChainAssets] = useState<Asset[]>();
  const [fromChainAsset, setFromChainAsset] = useState('');
  const [toChainAsset, setToChainAsset] = useState('');
  const skipClient = createSkipRouterClient();
  const [route, setRoute] = useState<RouteResponse>();
  const [intermediateAddresss, setIntermediateAddresss] = useState({});

  const handleFromChange = (e: SelectChangeEvent<string>) => {
    const chainID = e.target.value;
    setFromChain(chainID);
    const chainAssets = assetsInfo.assetsInfo?.[chainID];
    setFromChainAssets(chainAssets);
    // getRoute();
  };

  const handleToChange = (e: SelectChangeEvent<string>) => {
    const chainID = e.target.value;
    setToChain(chainID);
    const chainAssets = assetsInfo.assetsInfo?.[chainID];
    setToChainAssets(chainAssets);
    // getRoute();
  };

  const handleFromAssetChange = (e: SelectChangeEvent<string>) => {
    setFromChainAsset(e.target.value);
    // getRoute();
  };

  const handleToAssetChange = (e: SelectChangeEvent<string>) => {
    setToChainAsset(e.target.value);
    console.log(e.target.value);
    getRoute(e.target.value);
  };

  const [amount, setAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAmount(e.target.value);
  };

  const getRoute = (destAssetDenom: string) => {
    // if (fromChainAsset && fromChain && toChain && toChainAsset) {
    try {
      (async () => {
        try {
          const fromChainDecimals = getDecimals(
            fromChainAssets || [],
            fromChain
          );
          const amountIn = Number(amount) * 10 ** fromChainDecimals;
          const res = await skipClient.route({
            amountIn: amountIn.toString(),
            sourceAssetChainID: fromChain,
            sourceAssetDenom: fromChainAsset,
            destAssetChainID: toChain,
            destAssetDenom: destAssetDenom,
            cumulativeAffiliateFeeBPS: '0',
            allowUnsafe: true,
            experimentalFeatures: ['cctp'],
            clientID: '',
            allowMultiTx: true,
          });
          setRoute(res);
          console.log(res);
          console.log(toChainAssets, toChain);
          const decimals = getDecimals(toChainAssets || [], toChain);
          console.log(res.amountOut, decimals);
          const amountOut = Number(res.amountOut) / 10.0 ** decimals;
          setToAmount(amountOut.toString());
          const addresses: Record<string, string> = {};
          ``;
          for (const chainID of res?.chainIDs) {
            const account = await window.wallet.getKey(chainID);
            addresses[chainID] = account.bech32Address;
          }

          // for destination
          const destAccountInfo = await window.wallet.getKey(toChain);
          addresses[toChain] = destAccountInfo?.bech32Address || '';
          setIntermediateAddresss(addresses);
        } catch (error) {
          console.log(error);
        }
      })();
    } catch (error) {
      console.log(error);
    }
    // }
  };

  const txIBCSwap = async () => {
    try {
      await skipClient.executeRoute({
        route,
        userAddresses: intermediateAddresss,
        getGasPrice: getFee,
        onTransactionBroadcast: async (txInfo: {
          txHash: string;
          chainID: string;
        }) => {
          // when the transaction is broadcasted on source chain
          console.log('Txn broadcasted....');
        },
        onTransactionCompleted: async (chainID: string, txHash: string) => {
          // when the transaction is broadcasted on destination chain
          console.log('txn completed');
        },
      });
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    } catch (err: any) {
      console.log('-----');
      console.log(err);
      throw err;
    }
  };

  return (
    <div className="flex flex-col gap-8 justify-center items-center h-screen">
      <div className="flex flex-col gap-4">
        <div>From</div>
        <div className="flex gap-8">
          <Select
            className="bg-[#FFFFFF1A]"
            required
            label="Select Network"
            value={fromChain}
            onChange={(e) => handleFromChange(e)}
            sx={multiSelectDropDownStyle}
          >
            {chainsInfo.chainsInfo.map((a: Chain, index) => (
              <MenuItem key={index} value={a.chainID}>
                {a.prettyName}
              </MenuItem>
            ))}
          </Select>
          <Select
            className="bg-[#FFFFFF1A]"
            required
            label="Select Asset"
            value={fromChainAsset}
            onChange={(e) => handleFromAssetChange(e)}
            sx={multiSelectDropDownStyle}
          >
            {fromChainAssets?.map((asset: Asset, index) => (
              <MenuItem key={index} value={asset.originDenom}>
                {asset.symbol}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div>
          <TextField
            className="rounded-2xl bg-[#FFFFFF0D]"
            name="fromAmount"
            onChange={(e) => handleAmountChange(e)}
            sx={customMUITextFieldStyles}
            placeholder="Amount"
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div>To</div>
        <div className="flex gap-8">
          <Select
            className="bg-[#FFFFFF1A]"
            required
            label="Select Network"
            value={toChain}
            onChange={(e) => handleToChange(e)}
            sx={multiSelectDropDownStyle}
          >
            {chainsInfo.chainsInfo.map((a: Chain, index) => (
              <MenuItem key={index} value={a.chainID}>
                {a.prettyName}
              </MenuItem>
            ))}
          </Select>
          <Select
            className="bg-[#FFFFFF1A]"
            required
            label="Select Asset"
            value={toChainAsset}
            onChange={(e) => handleToAssetChange(e)}
            sx={multiSelectDropDownStyle}
          >
            {toChainAssets?.map((asset: Asset, index) => (
              <MenuItem key={index} value={asset.originDenom}>
                {asset.symbol}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div>
          <TextField
            className="rounded-2xl bg-[#FFFFFF0D]"
            name="toAmount"
            value={toAmount}
            sx={customMUITextFieldStyles}
            placeholder="0"
          />
        </div>
      </div>
      <div className="">
        <button
          onClick={() => txIBCSwap()}
          className="primary-gradient px-6 py-2 rounded-lg"
        >
          Swap
        </button>
      </div>
    </div>
  );
};

export default IBCSwap;
