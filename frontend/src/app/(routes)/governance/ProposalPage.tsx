'use client';

import { useParams } from 'next/navigation';
import React from 'react';
import ProposalOverviewVote from './ProposalOverviewVote';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import AuthzExecLoader from '@/components/AuthzExecLoader';

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
  let chainID;
  Object.keys(nameToChainIDs).forEach((chain) => {
    if (chain === chainName.toLowerCase()) chainID = nameToChainIDs[chainName];
  });
  const validId = () => {
    const parsedValue = parseInt(proposalId, 10);
    return !isNaN(parsedValue) && Number.isInteger(parsedValue);
  };
  return (
    <div>
      <AuthzExecLoader chainIDs={chainID ? [chainID] : []} />
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
