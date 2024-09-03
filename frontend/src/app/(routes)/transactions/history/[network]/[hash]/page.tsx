'use client';

import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import Transaction from '../components/Transaction';
import useGetTransactions from '@/custom-hooks/useGetTransactions';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { TxStatus } from '@/types/enums';
import TransactionLoading from '../../loaders/TransactionLoading';

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
  const txnStatus = useAppSelector(
    (state) => state.recentTransactions.txn.status
  );
  const txnResult = useAppSelector(
    (state) => state.recentTransactions.txn?.data?.[0]
  );

  useEffect(() => {
    txnHistory.fetchTransaction(paramTxHash[0]);
  }, []);

  return (
    <div>
      {txnStatus === TxStatus.PENDING ? (
        <TransactionLoading />
      ) : (
        <>
          {txnResult && chainID && (
            <Transaction
              hash={paramTxHash[0]}
              chainName={arrChainNames[0]}
              chainID={chainID}
            />
          )}
        </>
      )}
      {txnStatus === TxStatus.REJECTED ? <TransactionNotFound /> : null}
    </div>
  );
};

export default Page;

const TransactionNotFound = () => {
  const txSearchError = useAppSelector(
    (state) => state.recentTransactions.txn.error
  );

  if (txSearchError)
    return (
      <div className="w-full my-[25%]">
        <p className="text-h2 font-bold w-fit mx-auto">
          Sorry, the transaction you&apos;re looking for is not found.
        </p>
      </div>
    );
  return <></>;
};
