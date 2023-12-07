'use client';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { useParams } from 'next/navigation';
import React from 'react';
import GovPage from '../GovPage';

const page = () => {
  const params = useParams();
  const paramChain = params.network;
  const chainName = typeof paramChain === 'string' ? paramChain : '';
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  let chainID: string = '';
  Object.keys(nameToChainIDs).forEach((chain) => {
    if (chain === chainName) chainID = nameToChainIDs[chain];
  });

  return (
    <>
      {chainID.length ? (
        <GovPage chainIDs={[chainID]} />
      ) : (
        <div className="w-full h-full text-white flex justify-center items-center">
          - Chain Not found -
        </div>
      )}
    </>
  );
};

export default page;
