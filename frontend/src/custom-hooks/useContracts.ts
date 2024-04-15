import {
  getContract,
  queryContract,
} from '@/store/features/cosmwasm/cosmwasmService';
import { extractContractMessages } from '@/utils/util';
import { useState } from 'react';

const dummyQuery = {
  '': '',
};

const useContracts = () => {
  const [contractLoading, setContractLoading] = useState(false);
  const [contractError, setContractError] = useState('');
  const [queryError, setQueryError] = useState('');

  const [messagesLoading, setMessagesLoading] = useState(false);
  const [queryLoading, setQueryLoading] = useState(false);

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

  return {
    contractLoading,
    getContractInfo,
    contractError,
    getContractMessages,
    messagesLoading,
    getQueryContractOutput,
    queryLoading,
    queryError,
  };
};

export default useContracts;
