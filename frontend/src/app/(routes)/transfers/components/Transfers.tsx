'use client';

import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import React from 'react';
import TransfersPage from './TransfersPage';
import ChainNotFound from '@/components/ChainNotFound';

const Transfers = ({ chainNames }: { chainNames: string[] }) => {
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const chainIDs: string[] = [];
  Object.keys(nameToChainIDs).forEach((chain) => {
    chainNames.forEach((paramChain) => {
      if (chain === paramChain) chainIDs.push(nameToChainIDs[chain]);
    });
  });
  return chainIDs.length ? (
    <TransfersPage chainIDs={chainIDs} />
  ) : (
    <ChainNotFound />
  );
};

export default Transfers;
