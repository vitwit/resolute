'use client';
import React from 'react';
import Image from 'next/image';
import './style.css';

const Proposals = () => {
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
    {
      id: '123',
      title: 'Introduce Take Rate and deployment deposit for axlUSDC',
      expires: 'Expires in two days',
      votingStatus: 'Active Voting',
    },
  ];

  return (
    <div className="main-page">
      <div className="proposals-head">
        <div className="proposal-text-medium">Proposals</div>
        <div className="flex space-x-6">
          <button className="cstm-btn">
            <p className="proposal-text-extralight">All Proposals</p>
          </button>
          <button className="cstm-btn">
            <p className="proposal-text-extralight">Voting ending in 2 days</p>
          </button>
          <button className="cstm-btn">
            <p className="proposal-text-extralight">
              Show proposals in deposit
            </p>
          </button>
          <button className="cstm-btn">
            <p className="proposal-text-extralight">Recent proposals</p>
          </button>
        </div>
      </div>

      <div className="space-y-4 w-full">
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <Image
              src="./cosmos-logo.svg"
              width={32}
              height={32}
              alt="Cosmos-Logo"
            />
            <p className="proposal-text-medium">Cosmos</p>
          </div>
          <div className="view-history">View History</div>
        </div>
        <div className="v-line"></div>

        {proposalData.map((proposal, index) => (
          <div className="proposal" key={index}>
            <div className="proposal-id">
              <p className="proposal-text-extralight">{proposal.id}</p>
            </div>
            <div className="flex flex-col space-y-2">
              <p className="proposal-text-normal">{proposal.title}</p>
              <div className="flex space-x-4">
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

export default Proposals;
