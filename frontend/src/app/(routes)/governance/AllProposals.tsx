'use client';
import React from 'react';
import Image from 'next/image';
import './style.css';

const AllProposals = () => {
  const proposalData = [
    {
      id: '123',
      title: 'Introduce Take Rate and deployment deposit for axlUSDC',
      expires: 'Expires in two days',
      votingStatus: 'Active Voting',
    },
    {
      id: '123',
      title: 'Introduce Take Rate and deployment deposit for axlUSDC',
      expires: 'Expires in two days',
      votingStatus: 'Active Voting',
    },
    {
      id: '123',
      title: 'Introduce Take Rate and deployment deposit for axlUSDC',
      expires: 'Expires in two days',
      votingStatus: 'Active Voting',
    },
    {
      id: '123',
      title: 'Introduce Take Rate and deployment deposit for axlUSDC',
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
              src="/allnetworks.png"
              width={32}
              height={32}
              alt="AllNetworks-Logo"
            />
            <p className="proposal-text-medium">All Networks</p>
          </div>
        </div>
        <div className="v-line"></div>

        {proposalData.map((proposal, index) => (
          <div className="proposal" key={index}>
            <div className="flex justify-between items-center w-full">
              <div className="space-x-2 flex items-center">
                <div className="proposal-id">
                  <p className="proposal-text-extralight">{proposal.id}</p>
                </div>

                <p className="proposal-text-normal">{proposal.title}</p>
              </div>
              <div className="flex space-x-6"></div>
              <div className="flex space-x-6">
                <div className="flex space-x-1">
                  <Image
                    src="./timer-icon.svg"
                    width={24}
                    height={24}
                    alt="Timer-Icon"
                  />
                  <p className="proposal-text-small">{proposal.expires}</p>
                </div>
                <div className="flex space-x-1">
                  <Image
                    src="./vote-icon.svg"
                    width={24}
                    height={24}
                    alt="Vote-Icon"
                  />
                  <p className="proposal-text-small">{proposal.votingStatus}</p>
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
