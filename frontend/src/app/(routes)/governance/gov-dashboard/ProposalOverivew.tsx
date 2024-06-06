import { REDIRECT_ICON } from '@/constants/image-names';
import useGetProposals from '@/custom-hooks/governance/useGetProposals';
import Image from 'next/image';
import React from 'react';

const PROPOSAL_OVERVIEW_MAX_LENGTH = 300;

const ProposalOverview = ({
  chainID,
  proposalId,
  isActive,
  onClose,
}: {
  proposalId: string;
  chainID: string;
  isActive: boolean;
  onClose: () => void;
}) => {
  const { getProposalOverview } = useGetProposals();
  const { chainLogo, chainName, proposalInfo } = getProposalOverview({
    chainID,
    proposalId,
    isActive,
  });
  const { endTime, proposalDescription, proposalTitle } = proposalInfo;
  const truncatedDescription = proposalDescription.slice(
    0,
    PROPOSAL_OVERVIEW_MAX_LENGTH
  );
  const isDescriptionTruncated =
    truncatedDescription.length < proposalDescription.length;
  return (
    <div className="proposal-view">
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-10 w-full">
            <div className="items-start">
              <button className="secondary-btn" onClick={onClose}>
                Close
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4 justify-between">
                <div className="flex space-x-1 items-center">
                  <p className="text-h2 max-w-[400px] truncate">
                    {proposalTitle}
                  </p>
                  <Image
                    src={REDIRECT_ICON}
                    width={24}
                    height={24}
                    alt="View Proposal"
                  />
                </div>
                {isActive ? (
                  <div className="active-btn">Active</div>
                ) : (
                  <div className="deposit-btn">Deposit</div>
                )}
              </div>
              <div className="flex gap-6">
                <div className="flex gap-1 items-center">
                  <p className="text-small-light ">
                    {isActive ? 'Voting' : 'Deposit'}
                  </p>
                  <p className="text-b1">Ends in {endTime}</p>
                </div>
                <div className="flex gap-2 items-centers">
                  <p className="text-small-light ">on</p>
                  <Image
                    src={chainLogo}
                    width={20}
                    height={20}
                    alt="Network-logo"
                  />
                  <p className="text-b1 capitalize">{chainName}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 flex-col">
            <div className="text-white text-base">Proposal Summary</div>
            <div className="divider-line"></div>
            <div className="secondary-text">
              {truncatedDescription || proposalTitle}
              {isDescriptionTruncated && '...'}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-10 w-full ">
          <div className="flex justify-between gap-4">
            <button className="vote-optn-btn w-[133px] text-white text-base border-[#2BA472]">
              Yes
            </button>
            <button className="vote-optn-btn w-[133px] border-[#D92101] text-white text-base">
              No
            </button>
            <button className="vote-optn-btn w-[133px] border-[#FFC13C] text-white text-base">
              Abstain
            </button>
            <button className="vote-optn-btn w-[133px] border-[#DA561E] text-white text-base ">
              Veto
            </button>
          </div>

          <button className="primary-btn w-full">Vote</button>
        </div>
      </div>
    </div>
  );
};

export default ProposalOverview;
