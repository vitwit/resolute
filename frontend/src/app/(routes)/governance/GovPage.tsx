'use client';
import React, { useState } from 'react';
import Proposals from './Proposals';
import AllProposals from './AllProposals';
import RightOverview from './RightOverview';

const GovPage = ({ chainIDs }: { chainIDs: string[] }) => {
  const [proposalState, setProposalState] = useState('');
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const [currentOverviewId, setCurrentOverviewId] = useState(0);
  const [chainID, setChainID] = useState('');
  const [isSelected, setIsSelected] = React.useState<boolean>(false);

  const handleProposalSelected = (value: boolean) => {
    setIsSelected(value);
  };

  const handleChangeProposalState = (status: string) => {
    if (status === 'deposit') {
      setProposalState('deposit');
    } else if (status === '2days') {
      setProposalState('2days');
    } else {
      setProposalState('active');
    }
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
    <div className="w-full flex justify-end ">
      <div className="flex-1 scrollable-container">
        <Proposals handleChangeProposalState={handleChangeProposalState} />
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
          handleCloseOverview={handleCloseOverview}
          handleProposalSelected={handleProposalSelected}
        />
      )) ||
        null}
    </div>
  );
};

export default GovPage;
