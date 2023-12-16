'use client';

import { useParams } from 'next/navigation';
import React from 'react';
import ProposalOverviewVote from './ProposalOverviewVote';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import TopNav from '@/components/TopNav';

const ProposalPage = () => {
  const params = useParams();
  const { network, proposalId: id } = params;
  const chainName = typeof network === 'string' ? network : '';
  const proposalId = typeof id === 'string' ? id : '';
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const validChain = Object.keys(nameToChainIDs).some(
    (chain) => chainName.toLowerCase() === chain.toLowerCase()
  );
  const validId = () => {
    const parsedValue = parseInt(proposalId, 10);
    return !isNaN(parsedValue) && Number.isInteger(parsedValue);
  };
  return (
    <div>
      {/* <div className="flex justify-between w-full px-10 pt-6">
        <div className="proposal-text-big">Governance</div>
        <div className="w-[412px]">
          <TopNav />
        </div>
      </div> */}
      {validChain && validId() ? (
        <ProposalOverviewVote
          chainName={chainName}
          proposalId={parseInt(proposalId)}
        />
      ) : null}
      {!validChain ? (
        <div>- Chain not found -</div>
      ) : !validId() ? (
        <div>- Invalid Proposal ID -</div>
      ) : null}
    </div>
  );
};

export default ProposalPage;
