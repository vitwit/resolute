'use client';

import PageHeader from '@/components/common/PageHeader';
import useGetProposals from '@/custom-hooks/governance/useGetProposals';
import useInitGovernance from '@/custom-hooks/governance/useInitGovernance';
import React, { useRef, useState } from 'react';
import {
  HandleInputChangeEvent,
  ProposalsData,
  SelectedProposal,
} from '@/types/gov';
import ProposalsList from './ProposalsList';
import SearchProposalInput from './SearchProposalInput';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import GovDashboardLoading from '../loaders/GovDashboardLoading';
import ProposalOverview from './ProposalOverivew';
import { CSSTransition } from 'react-transition-group';

const GovDashboard = ({ chainIDs }: { chainIDs: string[] }) => {
  useInitGovernance({ chainIDs });
  const { getProposals } = useGetProposals();
  // const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeposits, setShowDeposits] = useState(false);
  const [filterDays, setFilterDays] = useState(0);
  const [showAnimation, toggleAnimation] = useState(false);
  const propsData = getProposals({ chainIDs, showAll:true });
  const proposalsData = getProposals({ chainIDs, showAll:true });
  const depositProposals = getProposals({chainIDs, deposits: true})
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
    setSelectedProposal((proposal) => {
      if (
        proposal?.chainID === chainID &&
        proposal?.proposalId === proposalId
      ) {
        return null;
      }
      toggleAnimation(true)
      return {
        chainID,
        proposalId,
        isActive,
      };
    });
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
          if (
            Number(daysNo[0]) <= days ||
            !proposal.proposalInfo.endTime.includes('days')
          ) {
            return true;
          }
        }
      });

      setFilteredProposals(filtered);
    }, 100);
  };

  const handleShowDeposits = (showDeposits: boolean) => {

    setShowDeposits(showDeposits)
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = window.setTimeout(() => {
      setFilteredProposals(depositProposals);
    }, 100);
  };

  // const handleShowAllProposals = (e: boolean) => {
  //   setShowAll(e);
  //   setSelectedProposal(null);
  // };

  return (
    <div className="gov-main">
      <div className="space-y-6 sticky top-0">
        <GovHeader />
      </div>
      <div className="flex h-full">
        <div
          className={`flex flex-col ${selectedProposal ? 'w-2/5' : 'w-full'}`}
        >
          <div className="sticky top-0 pt-6">
            <QuickFilters
              handleSearchQueryChange={handleSearchQueryChange}
              searchQuery={searchQuery}
              // handleShowAllProposals={handleShowAllProposals}
              handleFiltersChange={handleFiltersChange}
              filterDays={filterDays}
              selectedProposal={selectedProposal}
              handleShowDeposits={handleShowDeposits}
            />
          </div>
          <div className="flex flex-col flex-1 overflow-y-scroll gap-2 max-h-[70vh]">
            {proposalsLoading ? (
              <GovDashboardLoading />
            ) : (
              <>
                {searchQuery?.length || filterDays || showDeposits ? (
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
        </div>
        <CSSTransition
          in={showAnimation}
          timeout={300}
          classNames="proposal-overview"
          unmountOnExit
        >
          <div className="w-3/5 ml-10 h-full">
          {
            selectedProposal && (
              <ProposalOverview
                proposalId={selectedProposal?.proposalId}
                chainID={selectedProposal?.chainID}
                isActive={selectedProposal?.isActive}
                onClose={({chainID,isActive,proposalId})=>{
                  toggleAnimation(false)
                  setTimeout(() => {
                    handleViewProposal({chainID,isActive,proposalId})
                  }, 300);
                }}
              />
            )
          }
            
          </div>
        </CSSTransition>
      </div>
    </div>
  );
};

export default GovDashboard;

const QuickFilters = ({
  handleSearchQueryChange,
  searchQuery,
  // handleShowAllProposals,
  handleFiltersChange,
  filterDays,
  selectedProposal,
  handleShowDeposits
}: {
  searchQuery: string;
  handleSearchQueryChange: HandleInputChangeEvent;
  // handleShowAllProposals: (arg: boolean) => void;
  handleFiltersChange: (n: number) => void;
  filterDays: number;
  selectedProposal: SelectedProposal | null;
  handleShowDeposits: (arg: boolean) => void;
}) => {
  return (
    <div className="flex justify-between w-full pb-4">
      <div className="flex py-2 gap-2">
        <button
          onClick={() => handleFiltersChange(0)}
          className={`selected-btns text-[14px] ${
            filterDays === 0
              ? 'bg-[#ffffff14] border-transparent'
              : 'border-[#ffffff26]'
          }`}
        >
          All
        </button>
        <button
          onClick={() => handleFiltersChange(2)}
          className={`selected-btns text-[14px] ${
            filterDays === 2
              ? 'bg-[#ffffff14] border-transparent'
              : 'border-[#ffffff26]'
          }`}
        >
          Voting ends in 2 days
        </button>
        <button
          onClick={() => handleFiltersChange(1)}
          className={`selected-btns text-[14px] ${
            filterDays === 1
              ? 'bg-[#ffffff14] border-transparent'
              : 'border-[#ffffff26]'
          }`}
        >
          Voting ends in 1 day
        </button>
      </div>

      <div className="flex flex-1 items-end justify-end">
        {!selectedProposal && (
          <SearchProposalInput
            handleSearchQueryChange={handleSearchQueryChange}
            searchQuery={searchQuery}
            // handleShowAllProposals={handleShowAllProposals}
            handleShowDeposits={handleShowDeposits}
          />
        )}
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
