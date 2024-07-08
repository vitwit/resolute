'use client';
import React from 'react';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import PageMultisig from '../components/PageMultisig';

const ChainMultisig = ({ network }: { network: string }) => {
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.common.nameToChainIDs
  );
  const chainName = network.toLowerCase();
  const validChain = chainName in nameToChainIDs;
  return (
    <div>
      {validChain ? (
        <PageMultisig chainName={chainName} />
      ) : (
        <>
          <div className="flex justify-center items-center h-screen w-full text-[#ffffffad] txt-lg">
            - The {chainName} is not supported -
          </div>
        </>
      )}
    </div>
  );
};

export default ChainMultisig;
