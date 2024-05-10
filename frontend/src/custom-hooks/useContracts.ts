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
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';

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
  // ------------------------------------------//
  // ---------------DEPENDENCIES---------------//
  // ------------------------------------------//
  const { getDummyWallet } = useDummyWallet();
  const { getChainInfo } = useGetChainInfo();

  // ------------------------------------------//
  // ------------------STATES------------------//
  // ------------------------------------------//
  const [contractLoading, setContractLoading] = useState(false);
  const [contractError, setContractError] = useState('');
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState('');
  const [messageInputsLoading, setMessageInputsLoading] = useState(false);
  const [messageInputsError, setMessageInputsError] = useState('');
  const [executeMessagesLoading, setExecuteMessagesLoading] = useState(false);
  const [executeMessagesError, setExecuteMessagesError] = useState('');
  const [executeInputsLoading, setExecuteInputsLoading] = useState(false);
  const [executeInputsError, setExecuteInputsError] = useState('');

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
      if (errMsg?.includes('expected') || errMsg?.includes('missing field')) {
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
    extractedMessages,
    msgName,
  }: {
    address: string;
    baseURLs: string[];
    queryMsg: any;
    msgName: string;
    extractedMessages: string[];
  }) => {
    setMessageInputsLoading(true);
    setMessageInputsError('');

    const queryWithRetry = async (msg: {
      [key: string]: any;
    }): Promise<void> => {
      try {
        await queryContract(baseURLs, address, btoa(JSON.stringify(queryMsg)));
        return;
      } catch (error: any) {
        const errMsg = error.message;
        if (errMsg?.includes('Failed to query contract')) {
          setMessageInputsError('Failed to fetch messages');
          extractedMessages = [];
        } else if (errMsg?.includes('expected')) {
          setMessageInputsError('Failed to fetch messages');
          extractedMessages = [];
        } else {
          const newlyExtractedMessages = extractContractMessages(error.message);
          if (newlyExtractedMessages.length === 0) {
            return;
          } else {
            extractedMessages.push(...newlyExtractedMessages);
            for (const field of extractedMessages) {
              msg[msgName][field] = '1';
            }
            await queryWithRetry(msg);
          }
        }
      }
    };

    await queryWithRetry(queryMsg);
    setMessageInputsLoading(false);
    return {
      messages: extractedMessages,
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
    let messages: string[] = [];
    setExecuteMessagesLoading(true);
    setExecuteMessagesError('');
    let client: SigningCosmWasmClient;
    try {
      client = await connectWithSigner(rpcURLs, dummyWallet);
    } catch (error: any) {
      setExecuteMessagesError('Failed to fetch messages');
      setExecuteMessagesLoading(false);
      return { messages: [] };
    }
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
      return {
        messages: [],
      };
    } catch (error: any) {
      const errMsg = error.message;
      if (errMsg?.includes('expected') || errMsg?.includes('missing field')) {
        messages = extractContractMessages(error.message);
      } else {
        messages = [];
        setExecuteMessagesError('Failed to fetch messages');
      }
    } finally {
      setExecuteMessagesLoading(false);
    }
    return {
      messages,
    };
  };

  const getExecuteMessagesInputs = async ({
    rpcURLs,
    chainID,
    contractAddress,
    msg,
    msgName,
    extractedMessages,
  }: {
    rpcURLs: string[];
    chainID: string;
    contractAddress: string;
    msg: { [key: string]: any };
    msgName: string;
    extractedMessages: string[];
  }): Promise<{ messages: string[] }> => {
    const { dummyAddress, dummyWallet } = await getDummyWallet({ chainID });
    setExecuteInputsLoading(true);
    setExecuteInputsError('');
    let client: SigningCosmWasmClient;
    try {
      client = await connectWithSigner(rpcURLs, dummyWallet);
    } catch (error: any) {
      setExecuteInputsError('Failed to fetch messages');
      setExecuteInputsLoading(false);
      return { messages: [] };
    }

    const executeWithRetry = async (msg: {
      [key: string]: any;
    }): Promise<void> => {
      try {
        await client.simulate(
          dummyAddress,
          [
            {
              typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
              value: {
                sender: dummyAddress,
                contract: contractAddress,
                msg: Buffer.from(JSON.stringify(msg)),
                funds: [],
              },
            },
          ],
          undefined
        );

        return;
      } catch (error: any) {
        const errMsg = error.message;
        if (errMsg?.includes('expected') || errMsg?.includes('429')) {
          setExecuteInputsError('Failed to fetch messages');
          extractedMessages = [];
        } else if (errMsg?.includes('Insufficient')) {
          setExecuteInputsError('');
          return;
        } else {
          const newlyExtractedMessages = extractContractMessages(error.message);
          setExecuteInputsError('');
          if (newlyExtractedMessages.length === 0) {
            return;
          } else {
            extractedMessages.push(...newlyExtractedMessages);
            for (const field of extractedMessages) {
              msg[msgName][field] = '1';
            }
            await executeWithRetry(msg);
          }
        }
      }
    };

    await executeWithRetry(msg);
    setExecuteInputsLoading(false);
    return { messages: extractedMessages };
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
    getExecuteMessagesInputs,
    messageInputsLoading,
    messageInputsError,
    messagesError,
    executeMessagesError,
    executeMessagesLoading,
    executeInputsError,
    executeInputsLoading,
  };
};

export default useContracts;
