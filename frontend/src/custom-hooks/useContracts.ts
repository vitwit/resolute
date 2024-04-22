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
import { useAppDispatch } from './StateHooks';
import { setError } from '@/store/features/common/commonSlice';
import { TxResponse } from 'cosmjs-types/cosmos/base/abci/v1beta1/abci';
import { Event } from 'cosmjs-types/tendermint/abci/types';
import {
  setTxExecuteLoading,
  setTxExecuteStatus,
  setTxUploadStatus,
} from '@/store/features/cosmwasm/cosmwasmSlice';
import { TxStatus } from '@/types/enums';
import { toUtf8 } from '@cosmjs/encoding';

declare let window: WalletWindow;

const dummyQuery = {
  '': '',
};

const assetsData = chainDenoms as AssetData;

const getCodeIdFromEvents = (events: Event[]) => {
  let codeId;
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

const getCodeIdAndTxHash = (txData: any) => {
  if (txData?.code !== 0) {
    return;
  }
  const codeID = getCodeIdFromEvents(txData.events);
  if (!codeID) return;
  const txHash = txData?.txhash || txData?.transactionHash;
  return { codeID, txHash };
};

const useContracts = () => {
  const dispatch = useAppDispatch();
  const [contractLoading, setContractLoading] = useState(false);
  const [contractError, setContractError] = useState('');

  const [messagesLoading, setMessagesLoading] = useState(false);

  const [uploadContractLoading, setUploadContractLoading] = useState(false);

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
    const { coinDecimals, coinDenom } = feeCurrencies[0];
    const fee = {
      amount: [
        {
          amount: (feeAmount * 10 ** coinDecimals).toString(),
          denom: coinDenom,
        },
      ],
      gas: '900000',
    };
    try {
      dispatch(
        setTxExecuteStatus({
          chainID,
          error: '',
          status: TxStatus.PENDING,
          txHash: '',
          txnReponse: {
            code: 0,
            gasUsed: 0,
            gasWanted: 0,
            rawLog: '',
            transactionHash: '',
          },
        })
      );
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
      const {
        code,
        gasUsed,
        gasWanted,
        transactionHash,
        rawLog = '',
      } = response;
      dispatch(
        setTxExecuteStatus({
          chainID,
          error: '',
          status: TxStatus.IDLE,
          txHash: transactionHash,
          txnReponse: {
            code,
            gasUsed: Number(gasUsed),
            gasWanted: Number(gasWanted),
            rawLog,
            transactionHash,
          },
        })
      );
    } catch (error: any) {
      console.log(error);
      dispatch(
        setTxExecuteStatus({
          chainID,
          error: error?.message || 'Failed to execute',
          status: TxStatus.REJECTED,
          txHash: '',
          txnReponse: {
            code: 0,
            gasUsed: 0,
            gasWanted: 0,
            rawLog: '',
            transactionHash: '',
          },
        })
      );
    }
  };

  const uploadContract = async ({
    chainID,
    address,
    messages,
  }: {
    chainID: string;
    address: string;
    messages: Msg[];
  }) => {
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
      setUploadContractLoading(true);
      const resposne = await client.signAndBroadcast(
        address,
        messages,
        fee,
        undefined,
        undefined
      );
      setUploadContractLoading(false);
      const codeIdAndTxHash = getCodeIdAndTxHash(resposne);
      if (codeIdAndTxHash) {
        const { codeID = '', txHash } = codeIdAndTxHash;
        dispatch(
          setTxUploadStatus({
            chainID,
            error: '',
            status: TxStatus.IDLE,
            codeID,
            txHash,
          })
        );
      }
    } catch (error: any) {
      dispatch(
        setError({
          message: error?.message || 'Failed to upload contract',
          type: 'error',
        })
      );
    } finally {
      setUploadContractLoading(false);
    }
  };

  const instantiateContract = async ({
    chainID,
    codeId,
    msg,
    label,
    admin,
    funds,
  }: {
    chainID: string;
    codeId: number;
    msg: any;
    label: string;
    admin?: string;
    funds?: Coin[];
  }) => {
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
      gas: '900000',
    };
    try {
      const response = await client.instantiate(
        senderAddress,
        codeId,
        msg,
        label,
        fee,
        {
          admin,
          funds,
        }
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
    getExecuteMessages,
    getExecutionOutput,
    getChainAssets,
    uploadContract,
    uploadContractLoading,
    instantiateContract,
  };
};

export default useContracts;
