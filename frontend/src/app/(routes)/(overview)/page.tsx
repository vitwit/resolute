'use client';

import React from 'react';
import './overview.css';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import OverviewTable from './overview-components/OverviewTable';
import WithoutConnectionIllustration from '@/components/illustrations/WithoutConnectionIllustration';


const Overview = () => {

  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );

  const chainIDs = Object.keys(nameToChainIDs).map(
    (chainName) => nameToChainIDs[chainName]
  );

  const isWalletConnected = useAppSelector((state) => state.wallet.connected);

  return <div>
      {
        isWalletConnected?
        <OverviewTable chainIDs={chainIDs} />: 
        <WithoutConnectionIllustration />
      }
    
  </div>;
};

export default Overview;
