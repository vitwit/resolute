import React from 'react';
import Image from 'next/image';
import { REDIRECT_ICON, TIMER_ICON_YELLOW } from '@/constants/image-names';

type Proposal = {
  id: number;
  title: string;
  creator: string;
  votingEnds: string;
};

const proposals: Proposal[] = [
  {
    id: 123,
    title: 'Aave v3.1 Cantina competition',
    creator: 'Akash',
    votingEnds: '08 hours',
  },
  {
    id: 124,
    title: 'Aave v3.2 Cantina competition',
    creator: 'Cosmoshub',
    votingEnds: '12 hours',
  },
  {
    id: 125,
    title: 'Aave v3.3 Cantina competition',
    creator: 'Akash',
    votingEnds: '10 hours',
  },
  {
    id: 126,
    title: 'Aave v3.4 Cantina competition',
    creator: 'Akash',
    votingEnds: '14 hours',
  },
];

const ProposalCard: React.FC<{ proposal: Proposal }> = ({ proposal }) => (
  <div className="flex flex-col justify-center items-start gap-2 p-4 rounded-2xl bg-[#ffffff05]">
    <div className="flex gap-2">
      <div className="proposal-id">
        <span>{proposal.id}</span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <div>{proposal.title}</div>
          <button type="button" className="flex justify-center">
            <Image
              src={REDIRECT_ICON}
              width={24}
              height={24}
              alt="View-full-icon"
              draggable={false}
            />
          </button>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-1">
            <Image
              className="w-3 h-3 rounded-full"
              src="/akash1.png"
              width={12}
              height={12}
              alt=""
              draggable={false}
            />
            <p className="text-[rgba(255,255,255,0.50)] text-[10px] font-extralight capitalize">
              {proposal.creator}
            </p>
          </div>
          <div className="flex space-x-1">
            <Image
              src={TIMER_ICON_YELLOW}
              width={12}
              height={12}
              alt="timer-icon"
              draggable={false}
            />
            <p className="text-[#FFC13C] text-[10px] font-extralight">
              Voting ends in {proposal.votingEnds}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const GovernanceView = () => {
  return (
    <div className="flex flex-col p-6 rounded-2xl bg-[#ffffff05] w-[418px] gap-4 overflow-y-scroll flex-1">
      <div className="flex flex-col gap-2 w-full">
        <div className="text-h2">Governance</div>
        <div className="secondary-text">
          Connect your wallet now to access all the modules on{' '}
        </div>
        <div className="divider-line"></div>
      </div>
      {proposals.map((proposal) => (
        <ProposalCard key={proposal.id} proposal={proposal} />
      ))}
    </div>
  );
};

export default GovernanceView;
