'use client';

import React from 'react';
import './overview.css';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import WithoutConnectionIllustration from '@/components/illustrations/WithoutConnectionIllustration';
import OverviewDashboard from './overview-components/OverviewDashboard';

const Overview = () => {
  const { nameToChainIDs, connected: isWalletConnected, isLoading: isWalletLoading } = useAppSelector(
    (state: RootState) => state.wallet
  );

  const chainIDs = Object.keys(nameToChainIDs || {}).map(
    (chainName) => nameToChainIDs?.[chainName]
  );

  if (isWalletLoading) return null;

  return (
    <div>
      {isWalletConnected ? (
        <OverviewDashboard chainIDs={chainIDs} />
      ) : (
        <div className="flex flex-col mt-12">
          <div className="text-h1">Dashboard</div>
          <div className="flex flex-col gap-2">
            <div className="secondary-text">
              <p>Summary of your digital assets</p>
            </div>
            <div className="divider-line"></div>
          </div>
          <WithoutConnectionIllustration />
        </div>
      )}
    </div>
  );
};

export default Overview;
