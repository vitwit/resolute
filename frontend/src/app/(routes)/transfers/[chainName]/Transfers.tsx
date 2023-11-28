'use client';

import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import React from 'react';
import TransfersPage from '../components/TransfersPage';
import ChainNotFound from '@/components/ChainNotFound';

const Transfers = ({ chainName }: { chainName: string }) => {
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const chainID = nameToChainIDs[chainName];
  return chainID ? <TransfersPage chainID={chainID} /> : <ChainNotFound />;
};

export default Transfers;
