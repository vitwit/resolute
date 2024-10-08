'use client';
import React from 'react';
import TxnBuilder from '../components/TxnBuilder';
import { useAppSelector } from '@/custom-hooks/StateHooks';

const PageMultiops = ({ chainName }: { chainName: string }) => {
  const nameToChainIDs: Record<string, string> = useAppSelector(
    (state) => state.wallet.nameToChainIDs
  );
  const chainID = nameToChainIDs[chainName];
  return (
    <div className="h-screen flex flex-col p-6 px-10 gap-10">
      <div className="w-full flex justify-between items-center">
        <h2 className="text-[20px] leading-normal font-normal">MultiOps</h2>
      </div>
      <div className="rounded-2xl bg-[#1a1731] p-10 h-full overflow-y-scroll">
        <TxnBuilder chainID={chainID} />
      </div>
    </div>
  );
};

export default PageMultiops;
