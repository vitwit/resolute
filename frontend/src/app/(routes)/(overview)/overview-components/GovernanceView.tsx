import React from 'react';
import Image from 'next/image';
import { REDIRECT_ICON } from '@/constants/image-names';
import useInitGovernance from '@/custom-hooks/governance/useInitGovernance';
import useGetProposals from '@/custom-hooks/governance/useGetProposals';
import { get } from 'lodash';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import GovSkeleton from './GovSkeleton';
import Link from 'next/link';
// import useGetChainInfo from '@/custom-hooks/useGetChainInfo';

/* eslint-disable @typescript-eslint/no-explicit-any */
const ProposalCard: React.FC<{ proposal: any }> = ({ proposal }) => {
  // const { getChainInfo } = useGetChainInfo();
  // const chainID = get(proposal, 'chainID').toLowerCase();
  // const { chainLogo } = getChainInfo(chainID);

  return (
    <Link
      href={`/governance/${get(proposal, 'chainName', '')}/${get(proposal, 'proposalInfo.proposalId', '')}`}
    >
      <div className="justify-center items-start portfolio-card">
        <div className="flex gap-2">
          <div className="proposal-id-dashboard">
            <span className=" ">
              {get(proposal, 'proposalInfo.proposalId', 0)}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex gap-1 items-center">
              <div className="truncate w-[260px] hover:underline hover:underline-offset-[3px] text-[14px]">
                {get(proposal, 'proposalInfo.proposalTitle', '-')}
              </div>
              <button type="button" className="flex">
                <Image
                  src={REDIRECT_ICON}
                  width={18}
                  height={18}
                  alt="View-full-icon"
                  draggable={false}
                  className="opacity-50"
                />
              </button>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <Image
                  className="w-3 h-3 rounded-full"
                  src={get(proposal, 'chainLogo', '-')}
                  width={12}
                  height={12}
                  alt=""
                  draggable={false}
                />
                <p className="text-[12px] font-extralight capitalize">
                  {get(proposal, 'chainName', '-')}
                </p>
              </div>
              <div className="flex space-x-1 items-center">
                <Image
                  src="/Timer-icon.svg"
                  width={12}
                  height={12}
                  alt="timer-icon"
                  draggable={false}
                />
                <p className="text-[#FFC13C] text-[12px] font-extralight">
                  Voting ends in {get(proposal, 'proposalInfo.endTime', 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const GovernanceView = ({ chainIDs }: { chainIDs: string[] }) => {
  useInitGovernance({ chainIDs });
  const { getProposals } = useGetProposals();
  const proposalsData = getProposals({ chainIDs, showAll: false });

  const proposalsLoading =
    useAppSelector((state) => state.gov?.activeProposalsLoading) >
    chainIDs?.length;

  return (
    <div className="flex flex-col p-6 rounded-2xl bg-[#ffffff05] w-[418px] gap-4 overflow-y-scroll flex-1">
      <div className="flex flex-col gap-1 w-full">
        <div className="text-h2 !font-bold">Governance</div>
        <div className="flex flex-col gap-2 mb-2">
          <div className="secondary-text">
            Active proposals on cosmos ecosystem
          </div>
          <div className="divider-line"></div>
        </div>
      </div>

      {proposalsData.map((proposal) => (
        <ProposalCard
          key={get(proposal, 'proposalInfo.proposalId', 0)}
          proposal={proposal}
        />
      ))}

      {proposalsLoading ? <GovSkeleton /> : null}

      {!proposalsLoading && !proposalsData.length
        ? 'No Active Proposals found.'
        : null}
    </div>
  );
};

export default GovernanceView;
