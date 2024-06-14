'use client';

import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import React from 'react';
import TransfersPage from './TransfersPage';
import ChainNotFound from '@/components/ChainNotFound';

const Transfers = ({ chainNames }: { chainNames: string[] }) => {
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.common.nameToChainIDs
  );

  const chainIDs: string[] = [];

  chainNames.forEach((chainName) => {
    if (nameToChainIDs[chainName]) chainIDs.push(nameToChainIDs[chainName]);
  });

  return chainIDs.length ? (
    <TransfersPage chainIDs={chainIDs} />
  ) : (
    <ChainNotFound />
  );
};

export default Transfers;
