'use client';

import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import Transaction from '../components/Transaction';
import useGetTransactions from '@/custom-hooks/useGetTransactions';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';

const Page = () => {
  const params = useParams();
  const paramHash = params.hash;

  const paramTxHash = typeof paramHash === 'string' ? [paramHash] : paramHash;

  const nameToChainsIDs = useAppSelector(
    (state: RootState) => state.common.nameToChainIDs
  );

  const paramChains = params.network;

  const arrChainNames =
    typeof paramChains === 'string' ? [paramChains] : paramChains;

  const chainID = nameToChainsIDs[arrChainNames[0]];

  const txnHistory = useGetTransactions({ chainID });

  useEffect(() => {
    txnHistory.fetchTransaction(paramTxHash[0]);
  }, []);

  return (
    <div>
      <Transaction hash={paramTxHash[0]} chainName={arrChainNames[0]} />
    </div>
  );
};

export default Page;
