'use client';
import React, { useState } from 'react';
import Proposals from './Proposals';
import AllProposals from './AllProposals';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import RightOverview from './RightOverview';

const Page = () => {
  const [proposalState, setProposalState] = React.useState('');
  const [isOverviewOpen, setIsOverviewOpen] = React.useState(false);
  const [currentOverviewId, setCurrentOverviewId] = React.useState(0);
  const [chainID, setChainID] = React.useState('');
  const [isSelected, setIsSelected] = useState<boolean>(false);

  const handleProposalSelected = (value: boolean) => {
    setIsSelected(value);
  };

  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );

  const chainIDs = Object.keys(nameToChainIDs).map(
    (chainName) => nameToChainIDs[chainName]
  );

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

export default Page;
