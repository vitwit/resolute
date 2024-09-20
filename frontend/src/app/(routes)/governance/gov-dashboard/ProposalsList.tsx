import {
  HandleSelectProposalEvent,
  ProposalsData,
  SelectedProposal,
} from '@/types/gov';
import React from 'react';
import ProposalItem from './ProposalItem';
import EmptyScreen from '@/components/common/EmptyScreen';
import { NO_DATA_ILLUSTRATION } from '@/constants/image-names';

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
    <div className="w-full">
      {proposals?.length ? (
        proposals.map((proposalsData) => {
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
        })
      ) : (
        <EmptyScreen
          title="No Proposals"
          description=""
          bgImage={NO_DATA_ILLUSTRATION}
          width={246}
          height={264}
        />
      )}
    </div>
  );
};

export default ProposalsList;
