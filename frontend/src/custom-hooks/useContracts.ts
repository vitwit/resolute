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
import { Event } from 'cosmjs-types/tendermint/abci/types';
import { toUtf8 } from '@cosmjs/encoding';

declare let window: WalletWindow;

const dummyQuery = {
  '': '',
};

const assetsData = chainDenoms as AssetData;

const GAS = '900000';

const getCodeIdFromEvents = (events: Event[]) => {
  let codeId = '';
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    if (event.type === 'store_code') {
      for (let j = 0; j < event.attributes.length; j++) {
        const attribute = event.attributes[j];
        if (attribute.key === 'code_id') {
          codeId = attribute.value;
          break;
        }
      }
    }
  }
  return codeId;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const getCodeId = (txData: any) => {
  return getCodeIdFromEvents(txData?.events || []);
};

const useContracts = () => {
  const [contractLoading, setContractLoading] = useState(false);
  const [contractError, setContractError] = useState('');
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState('');
  const [messageInputsLoading, setMessageInputsLoading] = useState(false);
  const [messageInputsError, setMessageInputsError] = useState('');

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
    queryMsg = dummyQuery,
  }: {
    address: string;
    baseURLs: string[];
    queryMsg?: any;
  }) => {
    let messages: string[] = [];
    try {
      setMessagesLoading(true);
      setMessagesError('');
      await queryContract(baseURLs, address, btoa(JSON.stringify(queryMsg)));
      return {
        messages: [],
      };
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      const errMsg = error.message;
      if (
        errMsg?.includes('expected one of') ||
        errMsg?.includes('missing field')
      ) {
        messages = extractContractMessages(error.message);
      } else {
        messages = [];
        setMessagesError('Failed to fetch messages');
      }
    } finally {
      setMessagesLoading(false);
    }
    return {
      messages,
    };
  };

  const getContractMessageInputs = async ({
    address,
    baseURLs,
    queryMsg,
  }: {
    address: string;
    baseURLs: string[];
    queryMsg: any;
  }) => {
    let messages: string[] = [];
    try {
      setMessageInputsLoading(true);
      setMessageInputsError('');
      await queryContract(baseURLs, address, btoa(JSON.stringify(queryMsg)));
      return {
        messages: [],
      };
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      const errMsg = error.message;
      if (
        errMsg?.includes('expected one of') ||
        errMsg?.includes('missing field')
      ) {
        messages = extractContractMessages(error.message);
      } else {
        messages = [];
        setMessageInputsError('Failed to fetch message inputs');
      }
    } finally {
      setMessageInputsLoading(false);
    }
    return {
      messages,
    };
  };

  const getQueryContract = async ({
    address,
    baseURLs,
    queryData,
  }: GetQueryContractFunctionInputs) => {
    try {
      const respose = await queryContract(baseURLs, address, btoa(queryData));
      return {
        data: await respose.json(),
      };
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      throw new Error(error.message);
    }
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
  }: GetExecutionOutputFunctionInputs) => {
    const offlineSigner = window.wallet.getOfflineSigner(chainID);
    const client = await connectWithSigner(rpcURLs, offlineSigner);
    const { feeAmount, feeCurrencies } = getChainInfo(chainID);
    const { coinDecimals, coinDenom } = feeCurrencies[0];
    const fee = {
      amount: [
        {
          amount: (feeAmount * 10 ** coinDecimals).toString(),
          denom: coinDenom,
        },
      ],
      gas: GAS,
    };
    try {
      const response = await client.signAndBroadcast(
        walletAddress,
        [
          {
            typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
            value: {
              sender: walletAddress,
              contract: contractAddress,
              msg: toUtf8(msgs),
              funds,
            },
          },
        ],
        fee,
        ''
      );
      return { txHash: response.transactionHash };
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to execute contract');
    }
  };

  const uploadContract = async ({
    chainID,
    address,
    messages,
  }: UploadContractFunctionInputs) => {
    const { feeAmount, feeCurrencies, rpcURLs } = getChainInfo(chainID);
    const { coinDecimals, coinDenom } = feeCurrencies[0];
    const offlineSigner = window.wallet.getOfflineSigner(chainID);
    const client = await connectWithSigner(rpcURLs, offlineSigner);

    const fee = {
      amount: [
        {
          amount: (feeAmount * 10 ** coinDecimals).toString(),
          denom: coinDenom,
        },
      ],
      gas: '1100000',
    };
    try {
      const response = await client.signAndBroadcast(
        address,
        messages,
        fee,
        undefined,
        undefined
      );
      const codeId = getCodeId(response);
      return { codeId, txHash: response?.transactionHash };
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to upload contract');
    }
  };

  const instantiateContract = async ({
    chainID,
    codeId,
    msg,
    label,
    admin,
    funds,
  }: InstantiateContractFunctionInputs) => {
    const {
      feeAmount,
      feeCurrencies,
      rpcURLs,
      address: senderAddress,
    } = getChainInfo(chainID);
    const { coinDecimals, coinDenom } = feeCurrencies[0];
    const offlineSigner = window.wallet.getOfflineSigner(chainID);
    const client = await connectWithSigner(rpcURLs, offlineSigner);
    const fee = {
      amount: [
        {
          amount: (feeAmount * 10 ** coinDecimals).toString(),
          denom: coinDenom,
        },
      ],
      gas: GAS,
    };
    try {
      const response = await client.signAndBroadcast(
        senderAddress,
        [
          {
            typeUrl: '/cosmwasm.wasm.v1.MsgInstantiateContract',
            value: {
              sender: senderAddress,
              codeId: codeId,
              msg: toUtf8(msg),
              label: label,
              funds: funds || [],
              admin: admin,
            },
          },
        ],
        fee,
        ''
      );
      const instantiateEvent = response.events.find(
        (event) => event.type === 'instantiate'
      );
      const contractAddress =
        instantiateEvent?.attributes.find(
          (attr) => attr.key === '_contract_address'
        )?.value || '';
      const uploadedCodeId =
        instantiateEvent?.attributes.find((attr) => attr.key === 'code_id')
          ?.value || '';
      return {
        codeId: uploadedCodeId,
        contractAddress,
        txHash: response?.transactionHash,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to instantiate');
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
    getQueryContract,
    getExecuteMessages,
    getExecutionOutput,
    getChainAssets,
    uploadContract,
    instantiateContract,
    getContractMessageInputs,
    messageInputsLoading,
    messageInputsError,
    messagesError,
  };
};

export default useContracts;
