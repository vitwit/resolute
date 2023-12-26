'use client';
import React, { useState } from 'react';
import Proposals from './Proposals';
import AllProposals from './AllProposals';
import RightOverview from './RightOverview';

const GovPage = ({ chainIDs }: { chainIDs: string[] }) => {
  console.log('2222', chainIDs);
  const [proposalState, setProposalState] = useState('active');
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const [currentOverviewId, setCurrentOverviewId] = useState(0);
  const [chainID, setChainID] = useState('');
  const [isSelected, setIsSelected] = React.useState<boolean>(false);

  const handleProposalSelected = (value: boolean) => {
    setIsSelected(value);
  };

  const handleChangeProposalState = (status: string) => {
    setProposalState(status);
    setIsOverviewOpen(false);
    setCurrentOverviewId(0);
  };

  const handleOpenOverview = () => {
    setIsOverviewOpen(true);
  };

  const handleCloseOverview = () => {
    setIsOverviewOpen(false);
  };

  const handleSetCurrentOverviewId = (id: number, chainID: string) => {
    setCurrentOverviewId(id);
    setChainID(chainID);
  };

  return (
    <div className="w-full flex justify-end">
      <div className="flex-1 scrollable-container">
        <Proposals
          handleChangeProposalState={handleChangeProposalState}
          proposalStatus={proposalState}
        />
        <AllProposals
          handleOpenOverview={handleOpenOverview}
          status={proposalState}
          chainIDs={chainIDs}
          handleSetCurrentOverviewId={handleSetCurrentOverviewId}
          isRightBarOpen={false}
          currentOverviewId={currentOverviewId}
          handleProposalSelected={handleProposalSelected}
          isSelected={isSelected}
        />
      </div>
      {(isOverviewOpen && (
        <RightOverview
          proposalId={currentOverviewId}
          chainID={chainID}
          status={proposalState}
          handleCloseOverview={handleCloseOverview}
          handleProposalSelected={handleProposalSelected}
        />
      )) ||
        null}
    </div>
  );
};

export default GovPage;
