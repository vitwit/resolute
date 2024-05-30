import { useState } from 'react';
import Image from 'next/image';
import './style.css';
const ProposalDetails = [
  {
    proposalId: 123,
    networkLogo: '/akash-logo.svg',
    networkName: 'Akash',
    title: 'Aave v3.1 Cantina competition',
    address: '0x2cc1...c54Df1',
    timeline: 'ends in 01 hours',
    proposalSummary:
      'Following a successful implementation of Phase I of our plan to reduce stablecoin LTs and LTVs, we would like to propose the next phase. Additionally, we have updated our recommended final state for all associated stablecoins, with LTVs and LTs harmonized across all chains at 75% and 78%, respectively.',
  },
  {
    proposalId: 122,
    networkLogo: '/akash-logo.svg',
    networkName: 'Akash',
    title: 'Aave v3.1 Cantina competition',
    address: '0x2cc1...c54Df1',
    timeline: ' ends in 02 hours',
    proposalSummary:
      'Following a successful implementation of Phase I of our plan to reduce stablecoin LTs and LTVs, we would like to propose the next phase. Additionally, we have updated our recommended final state for all associated stablecoins, with LTVs and LTs harmonized across all chains at 75% and 78%, respectively.',
  },
  {
    proposalId: 124,
    networkLogo: '/akash-logo.svg',
    networkName: 'Akash',
    title: 'Aave v3.1 Cantina competition',
    address: '0x2cc1...c54Df1',
    timeline: 'ends in 03 hours',
    proposalSummary:
      'Following a successful implementation of Phase I of our plan to reduce stablecoin LTs and LTVs, we would like to propose the next phase. Additionally, we have updated our recommended final state for all associated stablecoins, with LTVs and LTs harmonized across all chains at 75% and 78%, respectively.',
  },
  {
    proposalId: 125,
    networkLogo: '/akash-logo.svg',
    networkName: 'Akash',
    title: 'Aave v3.1 Cantina competition',
    address: '0x2cc1...c54Df1',
    timeline: 'ends in 04 hours',
    proposalSummary:
      'Following a successful implementation of Phase I of our plan to reduce stablecoin LTs and LTVs, we would like to propose the next phase. Additionally, we have updated our recommended final state for all associated stablecoins, with LTVs and LTs harmonized across all chains at 75% and 78%, respectively.',
  },
  {
    proposalId: 126,
    networkLogo: '/akash-logo.svg',
    networkName: 'Akash',
    title: 'Aave v3.1 Cantina competition',
    address: '0x2cc1...c54Df1',
    timeline: 'ends in 04 hours',
    proposalSummary:
      'Following a successful implementation of Phase I of our plan to reduce stablecoin LTs and LTVs, we would like to propose the next phase. Additionally, we have updated our recommended final state for all associated stablecoins, with LTVs and LTs harmonized across all chains at 75% and 78%, respectively.',
  },
];
const votingPeriod = ['Voting ends in 1 day', 'Deposit ends in 1 day'];

const GovernanceDashboard = () => {
  const [selectedVotingPeriod, setSelectedVotingPeriod] = useState(
    'Voting ends in 1 day'
  );

  const [selectedProposal, setSelectedProposal] = useState({
    proposalId: 0,
    networkLogo: '',
    networkName: '',
    title: '',
    address: '',
    timeline: '',
    proposalSummary: '',
  });

  return (
    <div className="flex flex-col items-start gap-20 px-10 py-20">
      <div className="flex flex-col gap-10  w-full">
        <div className="flex flex-col items-start w-full">
          <div className="text-white text-[28px] not-italic font-bold leading-[normal] text-start">
            Governance
          </div>
          <div className="text-[rgba(255,255,255,0.50)] text-sm not-italic font-extralight leading-8">
            Connect your wallet now to access all the modules on resolute{' '}
          </div>
          <div className="divider-line"></div>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-4">
            {votingPeriod.map((data, dataid) => (
              <div
                onClick={() => {
                  setSelectedVotingPeriod(data);
                }}
                key={dataid}
                className={`selected-btns text-white text-base not-italic font-normal leading-[normal] ${data === selectedVotingPeriod ? 'bg-[#ffffff14] border-none' : 'border-[rgba(255,255,255,0.50)]'}`}
              >
                {data}
              </div>
            ))}
          </div>
          <div className="search-bar">
            <Image src="/search.svg" width={24} height={24} alt="Search-Icon" />
            <input
              className="secondary-text bg-transparent border-none"
              placeholder=" Search Validator"
            />
            <input
              type="checkbox"
              className="ml-2 bg-transparent"
              title="Checkbox"
            />
            <span className="ml-2 secondary-text">Show all proposals</span>
          </div>
        </div>
      </div>
      <div className="flex gap-6 w-full h-full ">
        <div className="flex flex-col w-full gap-10 px-6 py-0 flex-1">
          {ProposalDetails.map((data, dataid) => (
            <div key={dataid} className="flex flex-col gap-4 w-full">
              <div className="flex justify-between w-full">
                <div className="flex flex-col gap-4">
                  <div className="flex gap-6">
                    <div className="flex relative">
                      <p className="proposal-id">{data.proposalId}</p>
                      <div className="absolute bottom-[-8px] right-[-4px] bottom-network-logo">
                        <Image
                          src={data.networkLogo}
                          width={20}
                          height={20}
                          alt="Network-Logo"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <p className="text-white text-lg font-normal leading-[normal] items-center flex">
                        {data.title}
                      </p>
                      <div
                        className="flex justify-center"
                        onClick={() => {
                          setSelectedProposal(data);
                        }}
                      >
                        <Image
                          src="/viewful.svg"
                          width={24}
                          height={24}
                          alt="View-full-icon"
                        />
                      </div>
                    </div>
                    {selectedProposal.proposalId ? null : (
                      <div className="active-btn">Active</div>
                    )}
                  </div>
                  <div className="flex gap-6">
                    <div className="flex space-x-1">
                      <Image
                        src="/address.svg"
                        width={16}
                        height={16}
                        alt="Address-icon"
                      />
                      <p className="secondary-text">{data.address}</p>
                    </div>
                    <div className="flex space-x-1">
                      <Image
                        src="/timer.svg"
                        width={16}
                        height={16}
                        alt="Address-icon"
                      />
                      <p className="secondary-text">Voting {data.timeline}</p>
                    </div>
                    <div className="flex space-x-1">
                      <Image
                        src={data.networkLogo}
                        width={16}
                        height={16}
                        alt="Address-icon"
                      />
                      <p className="secondary-text">
                        {data.networkName} Network
                      </p>
                    </div>
                  </div>
                </div>
                {selectedProposal.proposalId ? null : (
                  <div className="flex items-end justify-end">
                    <div className="primary-btn w-20">
                      <p className="text-white text-base not-italic leading-[normal]">
                        Vote
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="divider-line"></div>
            </div>
          ))}
        </div>

        {/* Right View */}
        {selectedProposal?.proposalId ? (
          <div className="proposal-view">
            <div className="flex flex-col justify-between h-full ">
              <div className="flex flex-col gap-6 ">
                <div className="flex flex-col gap-10 w-full">
                  <div className="items-start">
                    <button
                      className="secondary-btn"
                      onClick={() => {
                        setSelectedProposal({
                          proposalId: 0,
                          networkLogo: '',
                          networkName: '',
                          title: '',
                          address: '',
                          timeline: '',
                          proposalSummary: '',
                        });
                      }}
                    >
                      Go back
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <div className="flex space-x-1 items-center">
                        <p className="text-white text-lg font-normal leading-[normal]">
                          {selectedProposal.title}
                        </p>
                        <Image
                          src="/viewful.svg"
                          width={24}
                          height={24}
                          alt="View Proposal"
                        />
                      </div>
                      <div className="active-btn">Active</div>
                    </div>
                    <div className="flex gap-6">
                      <div className="flex gap-2">
                        <p className="text-[rgba(255,255,255,0.50)] text-xs font-extralight leading-[normal]">
                          By
                        </p>
                        <p className="text-white text-sm font-normal leading-[normal]">
                          {selectedProposal.address}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <p className="text-[rgba(255,255,255,0.50)] text-xs font-extralight leading-[normal]">
                          Voting
                        </p>
                        <p className="text-white text-sm font-normal leading-[normal]">
                          {selectedProposal.timeline}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <p className="text-[rgba(255,255,255,0.50)] text-xs font-extralight leading-[normal]">
                          on
                        </p>
                        <Image
                          src={selectedProposal.networkLogo}
                          width={20}
                          height={20}
                          alt="Network-logo"
                        />
                        <p className="text-white text-sm font-normal leading-[normal]">
                          {selectedProposal.networkName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 flex-col">
                  <div className="text-white text-base font-normal leading-[normal]">
                    Proposal Summary
                  </div>
                  <div className="divider-line"></div>
                </div>
                <div className="text-[rgba(255,255,255,0.50)] text-sm font-normal leading-[21px]">
                  {selectedProposal.proposalSummary}
                </div>
              </div>

              <div className="flex flex-col gap-10 w-full ">
                <div className="flex justify-between gap-4">
                  <button className="vote-optn-btn w-[133px] text-white text-base font-normal leading-[normal]">
                    Yes
                  </button>
                  <button className="vote-optn-btn w-[133px] text-white text-base font-normal leading-[normal]">
                    No
                  </button>
                  <button className="vote-optn-btn w-[133px] text-white text-base font-normal leading-[normal]">
                    Abstain
                  </button>
                  <button className="vote-optn-btn w-[133px] text-white text-base font-normal leading-[normal]">
                    Veto
                  </button>
                </div>
                <div className="flex justify-between w-full">
                  <button className="primary-btn w-[50%]">Vote</button>
                  <button className="w-[50%] text-white text-base not-italic font-normal leading-[normal] underline">
                    View Full Proposal
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default GovernanceDashboard;
