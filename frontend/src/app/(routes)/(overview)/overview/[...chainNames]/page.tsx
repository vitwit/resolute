'use client';

import React from 'react';
// import OverviewPage from '../../overview-components/OverviewPage';
import '../../overview.css';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { useParams } from 'next/navigation';
// import OverviewTable from '../../overview-components/OverviewTable';
import WithoutConnectionIllustration from '@/components/illustrations/WithoutConnectionIllustration';
import OverviewDashboard from '../../overview-components/OverviewDashboard';

const Overview = () => {
  const params = useParams();
  const paramChains = params.chainNames;
  const chainNames =
    typeof paramChains === 'string' ? [paramChains] : paramChains;
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const isWalletConnected = useAppSelector((state) => state.wallet.connected);
  const chainIDs: string[] = [];
  Object.keys(nameToChainIDs).forEach((chain) => {
    chainNames.forEach((paramChain) => {
      if (chain === paramChain) chainIDs.push(nameToChainIDs[chain]);
    });
  });

  return (
    <>
      {isWalletConnected ? (
        <>
          {chainIDs.length ? (
            <OverviewDashboard chainIDs={chainIDs} />
          ) : (
            // <OverviewPage chainIDs={chainIDs} />
            <div className="w-full h-full flex justify-center items-center">
              - Chain Not found -
            </div>
          )}
        </>
      ) : (
        <WithoutConnectionIllustration />
      )}
    </>
  );
};

export default Overview;
