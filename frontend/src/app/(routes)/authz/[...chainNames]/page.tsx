'use client';

import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { useParams } from 'next/navigation';
import React from 'react';
import AuthzPage from '../AuthzPage';
import '../authz.css';
import AuthzCard from '../components/AuthzCard';

const Authz = () => {
  const params = useParams();

  const paramChains = params.chainNames;
  const chainNames =
    typeof paramChains === 'string' ? [paramChains] : paramChains;
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const chainIDs: string[] = [];
  Object.keys(nameToChainIDs).forEach((chain) => {
    chainNames.forEach((paramChain) => {
      if (chain === paramChain) chainIDs.push(nameToChainIDs[chain]);
    });
  });

  return (
    <>
      {chainIDs.length ? (
        <AuthzPage chainIDs={chainIDs} />
      ) : (
        <div className="w-full h-full text-white flex justify-center items-center">
          - Chain Not found -
        </div>
      )}
      <AuthzCard/>
    </>
  );
};

export default Authz;
