'use client';
import React, { useEffect, useState } from 'react';
import Proposals from './Proposals';
import AllProposals from './AllProposals';
import RightOverview from './RightOverview';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { getBalances } from '@/store/features/bank/bankSlice';
import AuthzExecLoader from '@/components/AuthzExecLoader';

const GovPage = ({ chainIDs }: { chainIDs: string[] }) => {
  const [proposalState, setProposalState] = useState('active');
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const [currentOverviewId, setCurrentOverviewId] = useState(0);
  const [chainID, setChainID] = useState('');
  const [isSelected, setIsSelected] = React.useState<boolean>(false);
  const networks = useAppSelector((state) => state.wallet.networks);
  const dispatch = useAppDispatch();

  useEffect(() => {
    chainIDs.forEach((chainID) => {
      const allChainInfo = networks[chainID];
      const chainInfo = allChainInfo.network;
      const address = allChainInfo?.walletInfo?.bech32Address;
      const basicChainInputs = {
        baseURL: chainInfo.config.rest,
        baseURLs: chainInfo.config.restURIs,
        address,
        chainID,
      };

      dispatch(getBalances(basicChainInputs));
    });
  }, []);

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
      <AuthzExecLoader chainIDs={[chainID]} />
      <div className="flex-1 scrollable-container">
        <Proposals
          handleChangeProposalState={handleChangeProposalState}
          proposalStatus={proposalState}
          chainIDs={chainIDs}
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
