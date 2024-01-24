'use client';

import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import React from 'react';
import FeegrantPage from './FeegrantPage';
import './feegrant.css';

const Feegrant = () => {
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const chainIDs = Object.keys(nameToChainIDs).map(
    (chainName) => nameToChainIDs[chainName]
  );
  return <FeegrantPage chainIDs={chainIDs} />;
};

export default Feegrant;
