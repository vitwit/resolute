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
  const [filterDays, setFilterDays] = useState(0);
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
        (proposal) => {
          return  proposal.proposalInfo.proposalId.includes(query) ||
          proposal.proposalInfo.proposalTitle
            .toLowerCase()
            .includes(query.toLowerCase()) ||
          proposal.chainName.toLowerCase().includes(query.toLowerCase())
        }
         
      );
      setFilteredProposals(filtered);
    }, 500);
  };

  const handleFiltersChange = (days: number) => {  
    setFilterDays(days)

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = window.setTimeout(() => {
      const filtered = propsData.filter(
        (proposal) => {
          if (!days) {
            return true
          }

          const daysNo = proposal.proposalInfo.endTime.match(/\d+/) || 0;
          if (daysNo && daysNo.length) {
            if (Number(daysNo[0])<= days){
              return true
            } 
          }
        }
      );

      console.log({filtered})
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
          handleFiltersChange={handleFiltersChange}
        />
      </div>
      <div className="flex gap-6 w-full flex-1 h-full overflow-y-scroll py-6">
        <div className="flex flex-col w-full gap-6 py-0 pb-6 flex-1 overflow-y-scroll">
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
}: {
  searchQuery: string;
  handleSearchQueryChange: HandleInputChangeEvent;
  handleShowAllProposals: HandleInputChangeEvent;
  handleFiltersChange: (n: number) => void;
}) => {
  // TODO: Add quick filters (Voting ends in 1 day & Deposit ends in 1 day)
  return (
    <div>
      <div className='flex py-2 gap-4'>
      <button onClick={()=>handleFiltersChange(0)} className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded'>
          All
        </button>
        <button onClick={()=>handleFiltersChange(2)} className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded'>
          Voting ends in 2 days
        </button>
        <button onClick={()=>handleFiltersChange(1)} className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded'>
          Voting ends in 1 days
        </button>
      </div>

      <div className="h-[56px] flex flex-col items-end">
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