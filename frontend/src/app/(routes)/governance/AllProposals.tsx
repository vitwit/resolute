'use client';
import React from 'react';
import Image from 'next/image';
import './style.css';

const AllProposals = () => {
  const proposalData = [
    {
      id: '123',
      title: 'Introduce Take Rate and deployment deposit for axlUSDC',
      networkname: 'Akash',
      expires: 'Expires in two days',
      votingStatus: 'Active Voting',
    },
    {
      id: '123',
      title: 'Introduce Take Rate and deployment deposit for axlUSDC',
      networkname: 'Akash',
      expires: 'Expires in two days',
      votingStatus: 'Active Voting',
    },
  ];

  return (
    <div className="main-page">
      <div className="space-y-4 w-full">
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <Image
              src="./cosmos-logo.svg"
              width={32}
              height={32}
              alt="Cosmos-Logo"
            />
            <p className="flex items-center text-white text-base font-medium">
              All Networks
            </p>
          </div>
        </div>
        <div className="v-line"></div>

        {proposalData.map((proposal, index) => (
          <div className="proposal" key={index}>
            <div className="proposal-id">
              <p className="text-white text-sm  font-extralight leading-[14px]">
                {proposal.id}
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <p className="text-white text-sm  font-normal leading-6">
                {proposal.title}
              </p>
              <div className="flex space-x-4">
                <div className="flex space-x-1">
                  <Image
                    src="./akash-logo.svg"
                    width={20}
                    height={20}
                    alt="Akash-Logo"
                  />
                  <p className=" flex items-center text-[rgba(255,255,255,0.75)] text-sm font-light leading-[14px]">
                    {proposal.networkname}
                  </p>
                </div>
                <div className="flex space-x-1">
                  <Image
                    src="./timer-icon.svg"
                    width={24}
                    height={24}
                    alt="Timer-Icon"
                  />
                  <p className=" flex items-center text-[rgba(255,255,255,0.75)] text-sm font-light leading-[14px]">
                    {proposal.expires}
                  </p>
                </div>
                <div className="flex space-x-1">
                  <Image
                    src="./vote-icon.svg"
                    width={24}
                    height={24}
                    alt="Vote-Icon"
                  />
                  <p className="flex items-center text-[rgba(255,255,255,0.75)] text-sm  font-light leading-[14px]">
                    {proposal.votingStatus}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProposals;
