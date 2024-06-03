'use client';
import React from 'react';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import GovPage from './GovPage';
import NoProposals from './NoProposals';

const Page = () => {
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );

  const chainIDs = Object.keys(nameToChainIDs).map(
    (chainName) => nameToChainIDs[chainName]
  );

  return (
    <>
      <GovPage chainIDs={chainIDs} />
      <NoProposals />
    </>
  );
};

export default Page;
