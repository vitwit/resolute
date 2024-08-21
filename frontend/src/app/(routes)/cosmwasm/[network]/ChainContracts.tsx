'use client';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import React from 'react';
import PageContracts from './PageContracts';

const ChainContracts = ({ network }: { network: string }) => {
  const nameToChainIDs = useAppSelector((state) => state.wallet.nameToChainIDs);
  const chainName = network.toLowerCase();
  const validChain = chainName in nameToChainIDs;
  return (
    <div>
      {validChain ? (
        <PageContracts chainName={chainName} />
      ) : (
        <>
          <div className="flex justify-center items-center h-screen w-full text-white txt-lg">
            - The {chainName} is not supported -
          </div>
        </>
      )}
    </div>
  );
};

export default ChainContracts;
