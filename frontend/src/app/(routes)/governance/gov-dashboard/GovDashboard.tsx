'use client';

import PageHeader from '@/components/common/PageHeader';
import {
  REDIRECT_ICON,
  SEARCH_ICON,
  TIMER_ICON,
} from '@/constants/image-names';
import useGetProposals from '@/custom-hooks/governance/useGetProposals';
import useInitGovernance from '@/custom-hooks/governance/useInitGovernance';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import ProposalOverivew from './ProposalOverivew';
import { ProposalsData } from '@/types/gov';

interface SelectedProposal {
  chainID: string;
  proposalId: string;
  isActive: boolean;
}

type HandleInputChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => void;

const GovDashboard = ({ chainIDs }: { chainIDs: string[] }) => {
  useInitGovernance({ chainIDs });
  const { getProposals } = useGetProposals();
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const propsData = getProposals({ chainIDs, showAll: showAll });
  const [proposalsData, setProposalsData] = useState<ProposalsData[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<ProposalsData[]>(
    []
  );
  let debounceTimeout = useRef<number | null>(null);

  const [selectedProposal, setSelectedProposal] =
    useState<SelectedProposal | null>(null);

  const handleViewProposal = ({
    chainID,
    proposalId,
    isActive,
  }: SelectedProposal) => {
    setSelectedProposal({
      chainID,
      proposalId,
      isActive,
    });
  };

  const onCloseOverview = () => {
    setSelectedProposal(null);
  };

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = window.setTimeout(() => {
      const filtered = propsData.filter(
        (proposal) =>
          proposal.proposalInfo.proposalId.includes(query) ||
          proposal.proposalInfo.proposalTitle
            .toLowerCase()
            .includes(query.toLowerCase()) ||
          proposal.chainName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProposals(filtered);
    }, 500);
  };

  const handleShowAllProposals = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowAll(e.target.checked);
    const data = getProposals({ chainIDs, showAll: e.target.checked });
    setProposalsData(data);
  };

  useEffect(() => {
    setProposalsData(propsData);
  }, [propsData]);

  return (
    <div className="gov-main">
      <div className="space-y-10 sticky top-0">
        <GovHeader />
        <QuickFilters
          handleSearchQueryChange={handleSearchQueryChange}
          searchQuery={searchQuery}
          handleShowAllProposals={handleShowAllProposals}
        />
      </div>
      <div className="flex gap-6 w-full flex-1 h-full overflow-y-scroll py-6">
        <div className="flex flex-col w-full gap-6 py-0 pb-6 flex-1 overflow-y-scroll">
          {searchQuery?.length ? (
            <ProposalsList
              proposals={filteredProposals}
              handleViewProposal={handleViewProposal}
              selectedProposal={selectedProposal}
            />
          ) : (
            <ProposalsList
              proposals={proposalsData}
              handleViewProposal={handleViewProposal}
              selectedProposal={selectedProposal}
            />
          )}
        </div>
        {selectedProposal ? (
          <ProposalOverivew
            proposalId={selectedProposal?.proposalId}
            chainID={selectedProposal?.chainID}
            isActive={selectedProposal?.isActive}
            onClose={onCloseOverview}
          />
        ) : null}
      </div>
    </div>
  );
};

export default GovDashboard;

const QuickFilters = ({
  handleSearchQueryChange,
  searchQuery,
  handleShowAllProposals,
}: {
  searchQuery: string;
  handleSearchQueryChange: HandleInputChangeEvent;
  handleShowAllProposals: HandleInputChangeEvent;
}) => {
  return (
    <div className="h-[56px] flex flex-col items-end">
      <SearchProposalInput
        handleSearchQueryChange={handleSearchQueryChange}
        searchQuery={searchQuery}
        handleShowAllProposals={handleShowAllProposals}
      />
    </div>
  );
};

const SearchProposalInput = ({
  searchQuery,
  handleSearchQueryChange,
  handleShowAllProposals,
}: {
  searchQuery: string;
  handleSearchQueryChange: HandleInputChangeEvent;
  handleShowAllProposals: HandleInputChangeEvent;
}) => {
  return (
    <div className="search-proposal-field">
      <div className="flex items-center gap-1 justify-between flex-1">
        <div className="flex items-center gap-2 flex-1">
          <Image src={SEARCH_ICON} height={24} width={24} alt="" />
          <input
            type="text"
            placeholder="Search Propoal by Name, ID, and Network"
            value={searchQuery}
            onChange={handleSearchQueryChange}
            className="search-proposal-input flex-1"
            autoFocus={true}
          />
        </div>
        <div className="flex items-center gap-1 cursor-pointer">
          <input
            className="cursor-pointer"
            type="checkbox"
            id="showAllProps"
            onChange={(e) => handleShowAllProposals(e)}
          />
          <label
            htmlFor="showAllProps"
            className="text-b1 text-[#FFFFFF80] cursor-pointer"
          >
            Show all proposals
          </label>
        </div>
      </div>
    </div>
  );
};

const GovHeader = () => {
  return (
    <PageHeader
      title="Governance"
      description="Connect your wallet now to access all the modules on resolute "
    />
  );
};

const ProposalsList = ({
  proposals,
  selectedProposal,
  handleViewProposal,
}: {
  proposals: ProposalsData[];
  selectedProposal: SelectedProposal | null;
  handleViewProposal: ({
    chainID,
    isActive,
    proposalId,
  }: {
    proposalId: string;
    chainID: string;
    isActive: boolean;
  }) => void;
}) => {
  return (
    <>
      {proposals.map((proposalsData, index) => {
        const { chainID, chainLogo, chainName, isActive, proposalInfo } =
          proposalsData;
        const { endTime, proposalId, proposalTitle } = proposalInfo;
        return (
          <div key={index} className="flex flex-col gap-4 w-full">
            <div
              className={`flex justify-between w-full px-6 py-2 ${selectedProposal && selectedProposal.proposalId === proposalId && selectedProposal.chainID === chainID ? 'bg-[#ffffff14] rounded-2xl' : ''} `}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-6">
                  <div className="proposal-id">
                    <span>{proposalId}</span>
                    <div className="bottom-network-logo">
                      <Image
                        src={chainLogo}
                        width={20}
                        height={20}
                        alt="Network-Logo"
                      />
                    </div>
                  </div>
                  <div
                    className="flex space-x-1 items-center cursor-pointer"
                    onClick={() => {
                      handleViewProposal({
                        proposalId,
                        chainID,
                        isActive,
                      });
                    }}
                  >
                    <p
                      className={`text-h2 truncate ${selectedProposal ? 'max-w-[254px]' : 'max-w-[500px]'}`}
                    >
                      {proposalTitle}
                    </p>
                    <button type="button" className="flex justify-center">
                      <Image
                        src={REDIRECT_ICON}
                        width={24}
                        height={24}
                        alt="View-full-icon"
                      />
                    </button>
                  </div>
                  {selectedProposal ? null : (
                    <>
                      {isActive ? (
                        <div className="active-btn">Active</div>
                      ) : (
                        <div className="deposit-btn">Deposit</div>
                      )}
                    </>
                  )}
                </div>
                <div className="flex gap-6">
                  <div className="flex space-x-1">
                    <Image
                      src={TIMER_ICON}
                      width={16}
                      height={16}
                      alt="Address-icon"
                    />
                    <p className="secondary-text">
                      {isActive ? 'Voting ends in' : 'Deposit ends in'}{' '}
                      {endTime}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Image
                      className="w-4 h-4"
                      src={chainLogo}
                      width={16}
                      height={16}
                      alt=""
                    />
                    <p className="secondary-text capitalize">
                      {chainName} Network
                    </p>
                  </div>
                </div>
              </div>
              {selectedProposal ? null : (
                <div className="flex items-end justify-end">
                  <button className="primary-btn w-20">
                    {isActive ? 'Vote' : 'Deposit'}
                  </button>
                </div>
              )}
            </div>
            <div className="divider-line"></div>
          </div>
        );
      })}
    </>
  );
};
