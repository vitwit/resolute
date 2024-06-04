'use client';
import React from 'react';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';

import DepositProposal from './DepositProposal';
import FullProposalView from './FullProposalView';
import GovernanceDashboard from './GovernanceDashboard';

const Page = () => {
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );

  const chainIDs = Object.keys(nameToChainIDs).map(
    (chainName) => nameToChainIDs[chainName]
  );
  console.log(chainIDs);

  return (
    <>
      {/* <GovernanceDashboard /> */}
      <FullProposalView />
      {/* <DepositProposal /> */}
    </>
  );
};

export default Page;
