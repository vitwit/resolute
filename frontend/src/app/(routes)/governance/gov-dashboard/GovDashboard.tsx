'use client';

import PageHeader from '@/components/common/PageHeader';
import useGetProposals from '@/custom-hooks/governance/useGetProposals';
import useInitGovernance from '@/custom-hooks/governance/useInitGovernance';
import React, { useRef, useState } from 'react';
import ProposalOverivew from './ProposalOverivew';
import {
  HandleInputChangeEvent,
  ProposalsData,
  SelectedProposal,
} from '@/types/gov';
import ProposalsList from './ProposalsList';
import SearchProposalInput from './SearchProposalInput';

const GovDashboard = ({ chainIDs }: { chainIDs: string[] }) => {
  useInitGovernance({ chainIDs });
  const { getProposals } = useGetProposals();
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const propsData = getProposals({ chainIDs, showAll: showAll });
  const proposalsData = getProposals({ chainIDs, showAll: showAll });
  const [filteredProposals, setFilteredProposals] = useState<ProposalsData[]>(
    []
  );
  const debounceTimeout = useRef<number | null>(null);

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
    setSelectedProposal(null);
  };

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
  // TODO: Add quick filters (Voting ends in 1 day & Deposit ends in 1 day)
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

const GovHeader = () => {
  return (
    <PageHeader
      title="Governance"
      description="Connect your wallet now to access all the modules on resolute "
    />
  );
};
