import {
  connectWithSigner,
  getContract,
  queryContract,
} from '@/store/features/cosmwasm/cosmwasmService';
import { extractContractMessages } from '@/utils/util';
import { useState } from 'react';
import { useDummyWallet } from './useDummyWallet';
import chainDenoms from '@/utils/chainDenoms.json';
import useGetChainInfo from './useGetChainInfo';

declare let window: WalletWindow;

const dummyQuery = {
  '': '',
};

const assetsData = chainDenoms as AssetData;

const useContracts = () => {
  const [contractLoading, setContractLoading] = useState(false);
  const [contractError, setContractError] = useState('');
  const [queryError, setQueryError] = useState('');

  const [messagesLoading, setMessagesLoading] = useState(false);
  const [queryLoading, setQueryLoading] = useState(false);

  const { getDummyWallet } = useDummyWallet();
  const { getChainInfo } = useGetChainInfo();

  const getContractInfo = async ({
    address,
    baseURLs,
  }: {
    baseURLs: string[];
    address: string;
  }) => {
    try {
      setContractLoading(true);
      setContractError('');
      const res = await getContract(baseURLs, address);
      setContractError('');
      return {
        data: await res.json(),
      };
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      setContractError(error.message);
    } finally {
      setContractLoading(false);
    }
    return {
      data: null,
    };
  };

  const getContractMessages = async ({
    address,
    baseURLs,
  }: {
    address: string;
    baseURLs: string[];
  }) => {
    let messages = [];
    try {
      setMessagesLoading(true);
      setContractError('');
      await queryContract(baseURLs, address, btoa(JSON.stringify(dummyQuery)));
      return {
        messages: [],
      };
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      messages = extractContractMessages(error.message);
    } finally {
      setMessagesLoading(false);
    }
    return {
      messages,
    };
  };

  const getQueryContractOutput = async ({
    address,
    baseURLs,
    queryData,
  }: {
    address: string;
    baseURLs: string[];
    queryData: string;
  }) => {
    try {
      setQueryLoading(true);
      setQueryError('');
      const respose = await queryContract(baseURLs, address, btoa(queryData));
      return {
        data: await respose.json(),
      };
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      setQueryError(error.message);
    } finally {
      setQueryLoading(false);
    }
    return {
      data: {},
    };
  };

  const getExecuteMessages = async ({
    rpcURLs,
    chainID,
    contractAddress,
  }: {
    rpcURLs: string[];
    chainID: string;
    contractAddress: string;
  }) => {
    const { dummyAddress, dummyWallet } = await getDummyWallet({ chainID });
    const client = await connectWithSigner(rpcURLs, dummyWallet);
    try {
      await client.simulate(
        dummyAddress,
        [
          {
            typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
            value: {
              sender: dummyAddress,
              contract: contractAddress,
              msg: Buffer.from('{"": {}}'),
              funds: [],
            },
          },
        ],
        undefined
      );
    } catch (error: any) {
      console.log(error);
    }
  };

  const getExecutionOutput = async ({
    rpcURLs,
    chainID,
    contractAddress,
    walletAddress,
    msgs,
    funds,
  }: {
    rpcURLs: string[];
    chainID: string;
    contractAddress: string;
    walletAddress: string;
    msgs: any;
    funds: { amount: string; denom: string }[] | undefined;
  }) => {
    const offlineSigner = window.wallet.getOfflineSigner(chainID);
    const client = await connectWithSigner(rpcURLs, offlineSigner);
    const { feeAmount, feeCurrencies } = getChainInfo(chainID);
    const decimals = feeCurrencies[0].coinDecimals;
    try {
      const response = await client.execute(
        walletAddress,
        contractAddress,
        JSON.parse(msgs),
        {
          amount: [
            {
              amount: (feeAmount * 10 ** decimals).toString(),
              denom: 'ugrain',
            },
          ],
          gas: '900000',
        },
        undefined,
        funds
      );
      console.log(response);
    } catch (error: any) {
      console.log(error);
    }
  };

  const getChainAssets = (chainName: string) => {
    const chainAssets = assetsData?.[chainName];
    const assetsList: {
      coinMinimalDenom: string;
      decimals: number;
      symbol: string;
    }[] = [];
    chainAssets?.forEach((asset) => {
      assetsList.push({
        symbol: asset.symbol,
        decimals: asset.decimals,
        coinMinimalDenom: asset.origin_denom,
      });
    });
    return { assetsList };
  };

  return {
    contractLoading,
    getContractInfo,
    contractError,
    getContractMessages,
    messagesLoading,
    getQueryContractOutput,
    queryLoading,
    queryError,
    getExecuteMessages,
    getExecutionOutput,
    getChainAssets,
  };
};

export default useContracts;
