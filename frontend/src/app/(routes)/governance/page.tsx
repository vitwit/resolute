'use client';
import React from 'react';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import GovPage from './GovPage';

const Page = () => {
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.common.nameToChainIDs
  );

  const chainIDs = Object.keys(nameToChainIDs).map(
    (chainName) => nameToChainIDs[chainName]
  );

  return <GovPage chainIDs={chainIDs} />;
};

export default Page;
