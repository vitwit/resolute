import TopNav from '@/components/TopNav';
import React from 'react';
import Transaction from './Transaction';
import useGetTransactions from '@/custom-hooks/useGetTransactions';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';

const PageTxnHistory = ({ chainName }: { chainName: string }) => {
  const nameToChainIDs = useAppSelector((state) => state.wallet.nameToChainIDs);
  const chainID = nameToChainIDs[chainName];

  const { getDenomInfo, getChainInfo } = useGetChainInfo();
  const { decimals, displayDenom, minimalDenom } = getDenomInfo(chainID);
  const currency = {
    coinDenom: displayDenom,
    coinDecimals: decimals,
    coinMinimalDenom: minimalDenom,
  };
  const { getTransactions } = useGetTransactions({ chainID });
  const { txns } = getTransactions();
  return (
    <div className="py-6 px-10 h-screen space-y-10">
      <div className="flex justify-between">
        <h2 className="text-[20px] leading-normal font-normal">
          Transaction History
        </h2>
        <TopNav />
      </div>
      <div className="space-y-2">
        {txns?.map((txn) => (
          <Transaction txn={txn} key={txn.txhash} currency={currency} />
        ))}
      </div>
    </div>
  );
};

export default PageTxnHistory;
