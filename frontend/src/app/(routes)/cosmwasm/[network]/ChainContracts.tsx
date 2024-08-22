'use client';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import React from 'react';
import PageContracts from './PageContracts';
import { useSearchParams } from 'next/navigation';
import AllContracts from '../components/all-contracts/AllContracts';

const ChainContracts = ({ network }: { network: string }) => {
  const nameToChainIDs = useAppSelector((state) => state.common.nameToChainIDs);
  const chainName = network.toLowerCase();
  const validChain = chainName in nameToChainIDs;
  const chainID = nameToChainIDs?.[chainName];

  const paramTabName = useSearchParams().get('tab');

  return (
    <div>
      {validChain && chainID ? (
        paramTabName === 'codes' ? (
          <AllContracts chainID={chainID} />
        ) : (
          <PageContracts chainName={chainName} />
        )
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
