'use client';
import React from 'react';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import PageMultisig from '../components/PageMultisig';

const ChainMultisig = ({ paramChain }: { paramChain: string }) => {
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  let validChain = false;
  const chainName = paramChain.toLowerCase();
  Object.keys(nameToChainIDs).forEach((chain) => {
    if (paramChain.toLowerCase() === chain.toLowerCase()) {
      validChain = true;
    }
  });
  return (
    <div>
      {validChain ? (
        <PageMultisig chainName={chainName} />
      ) : (
        <>
          <div className="flex justify-center items-center h-screen w-full text-white txt-lg">
            - Chain not found -
          </div>
        </>
      )}
    </div>
  );
};

export default ChainMultisig;
