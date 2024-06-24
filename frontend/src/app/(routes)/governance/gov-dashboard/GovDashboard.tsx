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
import { useAppSelector } from '@/custom-hooks/StateHooks';
import GovDashboardLoading from '../loaders/GovDashboardLoading';

const GovDashboard = ({ chainIDs }: { chainIDs: string[] }) => {
  useInitGovernance({ chainIDs });
  const { getProposals } = useGetProposals();
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDays, setFilterDays] = useState(0);
  const propsData = getProposals({ chainIDs, showAll: showAll });
  const proposalsData = getProposals({ chainIDs, showAll: showAll });
  const [filteredProposals, setFilteredProposals] = useState<ProposalsData[]>(
    []
  );
  const debounceTimeout = useRef<number | null>(null);
  const [selectedProposal, setSelectedProposal] =
    useState<SelectedProposal | null>(null);

  const proposalsLoading =
    useAppSelector((state) => state.gov?.activeProposalsLoading) >
    chainIDs?.length;

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
      const filtered = propsData.filter((proposal) => {
        return (
          proposal.proposalInfo.proposalId.includes(query) ||
          proposal.proposalInfo.proposalTitle
            .toLowerCase()
            .includes(query.toLowerCase()) ||
          proposal.chainName.toLowerCase().includes(query.toLowerCase())
        );
      });
      setFilteredProposals(filtered);
    }, 500);
  };

  const handleFiltersChange = (days: number) => {
    setFilterDays(days);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = window.setTimeout(() => {
      const filtered = propsData.filter((proposal) => {
        if (!days) {
          return true;
        }

        const daysNo = proposal.proposalInfo.endTime.match(/\d+/) || 0;
        if (daysNo && daysNo.length) {
          if (Number(daysNo[0]) <= days || !proposal.proposalInfo.endTime.includes('days')) {
            return true;
          }
        }
      });

      setFilteredProposals(filtered);
    }, 100);
  };

  const handleShowAllProposals = (e: boolean) => {
    setShowAll(e);
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
          handleFiltersChange={handleFiltersChange}
          filterDays={filterDays}
        />
      </div>
      <div className="flex gap-6 w-full flex-1 h-full overflow-y-scroll">
        <div className="flex flex-col w-full gap-6 py-0 pb-6 flex-1 overflow-y-scroll">
          {proposalsLoading ? (
            <GovDashboardLoading />
          ) : (
            <>
              {searchQuery?.length || filterDays ? (
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
            </>
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
  handleFiltersChange,
  filterDays,
}: {
  searchQuery: string;
  handleSearchQueryChange: HandleInputChangeEvent;
  handleShowAllProposals: (arg: boolean) => void;
  handleFiltersChange: (n: number) => void;
  filterDays: number;
}) => {
  return (
    <div className="flex gap-20">
      <div className="flex py-2 gap-4">
        <button
          onClick={() => handleFiltersChange(0)}
          className={`selected-btns text-base ${filterDays === 0 ? 'bg-[#ffffff14] border-transparent' : 'border-[#ffffff26]'}`}
        >
          All
        </button>
        <button
          onClick={() => handleFiltersChange(2)}
          className={`selected-btns text-base ${filterDays === 2 ? 'bg-[#ffffff14] border-transparent' : 'border-[#ffffff26]'}`}
        >
          Voting ends in 2 days
        </button>
        <button
          onClick={() => handleFiltersChange(1)}
          className={`selected-btns text-base ${filterDays === 1 ? 'bg-[#ffffff14] border-transparent' : 'border-[#ffffff26]'}`}
        >
          Voting ends in 1 day
        </button>
      </div>

      <div className="flex items-end flex-1">
        <SearchProposalInput
          handleSearchQueryChange={handleSearchQueryChange}
          searchQuery={searchQuery}
          handleShowAllProposals={handleShowAllProposals}
        />
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
