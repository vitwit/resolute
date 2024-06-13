'use client';

import React from 'react';
// import OverviewPage from '../../overview-components/OverviewPage';
import '../../overview.css';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { useParams } from 'next/navigation';
import OverviewTable from '../../overview-components/OverviewTable';

const Overview = () => {
  const params = useParams();
  const paramChains = params.chainNames;
  const chainNames =
    typeof paramChains === 'string' ? [paramChains] : paramChains;
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const chainIDs: string[] = [];
  Object.keys(nameToChainIDs).forEach((chain) => {
    chainNames.forEach((paramChain) => {
      if (chain === paramChain) chainIDs.push(nameToChainIDs[chain]);
    });
  });
  
  return (
    <>
      {chainIDs.length ? (
        <OverviewTable chainIDs={chainIDs} />
        // <OverviewPage chainIDs={chainIDs} />
      ) : (
        <div className="w-full h-full text-white flex justify-center items-center">
          - Chain Not found -
        </div>
      )}
    </>
  );
};

export default Overview;
