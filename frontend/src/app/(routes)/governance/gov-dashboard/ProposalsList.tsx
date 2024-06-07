import { HandleSelectProposalEvent, ProposalsData, SelectedProposal } from '@/types/gov';
import React from 'react'
import ProposalItem from './ProposalItem';

const ProposalsList = ({
    proposals,
    selectedProposal,
    handleViewProposal,
  }: {
    proposals: ProposalsData[];
    
    selectedProposal: SelectedProposal | null;
    handleViewProposal: HandleSelectProposalEvent;
  }) => {
    return (
      <>
        {proposals.map((proposalsData) => {
          const { chainID, chainLogo, chainName, isActive, proposalInfo } =
            proposalsData;
          const { endTime, proposalId, proposalTitle } = proposalInfo;
          return (
            <ProposalItem
              key={chainID + proposalId}
              chainID={chainID}
              chainLogo={chainLogo}
              chainName={chainName}
              endTime={endTime}
              handleViewProposal={handleViewProposal}
              isActive={isActive}
              proposalId={proposalId}
              proposalTitle={proposalTitle}
              selectedProposal={selectedProposal}
            />
          );
        })}
      </>
    );
  };

export default ProposalsList