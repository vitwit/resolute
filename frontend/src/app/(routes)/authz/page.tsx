'use client';

import React from 'react';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import AuthzPage from './AuthzPage';
import './authz.css';

const Authz = () => {
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const chainIDs = Object.keys(nameToChainIDs).map(
    (chainName) => nameToChainIDs[chainName]
  );
  return <AuthzPage chainIDs={chainIDs} />;
};

export default Authz;
