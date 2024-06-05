'use client';

import PageHeader from '@/components/common/PageHeader';
import { REDIRECT_ICON, TIMER_ICON } from '@/constants/image-names';
import useGetProposals from '@/custom-hooks/governance/useGetProposals';
import useInitGovernance from '@/custom-hooks/governance/useInitGovernance';
import Image from 'next/image';
import React from 'react';

const GovDashboard = ({ chainIDs }: { chainIDs: string[] }) => {
  // const [showAll, setShowAll] = useState(true);
  useInitGovernance({ chainIDs });
  const { getProposals } = useGetProposals();
  const proposalsData = getProposals({ chainIDs, showAll: false });
  // const [selectedProposal, setSelectedProposal] = useState('');
  return (
    <div className="gov-main">
      <div className="space-y-10 sticky top-0">
        <GovHeader />
        <QuickFilters />
      </div>
      <div className="flex gap-6 w-full flex-1 h-full overflow-y-scroll">
        <div className="flex flex-col w-full gap-10 px-6 py-0 flex-1 overflow-y-scroll">
          {proposalsData.map((proposalsData, index) => {
            const { chainLogo, chainName, isActive, proposalInfo } =
              proposalsData;
            const { endTime, proposalId, proposalTitle } = proposalInfo;
            return (
              <div key={index} className="flex flex-col gap-4 w-full">
                <div className="flex justify-between w-full">
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
                      <div className="flex space-x-1">
                        <p className="text-h2 items-center flex">
                          {proposalTitle}
                        </p>
                        <div
                          className="flex justify-center"
                          onClick={() => {
                            // setSelectedProposal(data);
                          }}
                        >
                          <Image
                            src={REDIRECT_ICON}
                            width={24}
                            height={24}
                            alt="View-full-icon"
                          />
                        </div>
                      </div>
                      {isActive ? (
                        <div className="active-btn">Active</div>
                      ) : (
                        <div className="deposit-btn">Deposit</div>
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
                  <div className="flex items-end justify-end">
                    <button className="primary-btn w-20">
                      {isActive ? 'Vote' : 'Deposit'}
                    </button>
                  </div>
                </div>
                <div className="divider-line"></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GovDashboard;

const QuickFilters = () => {
  return <div className="h-[56px]"></div>;
};

const GovHeader = () => {
  return (
    <PageHeader
      title="Governance"
      description="Connect your wallet now to access all the modules on resolute "
    />
  );
};
