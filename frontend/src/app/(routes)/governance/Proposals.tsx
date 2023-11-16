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
    <div className="Main-page">
      <div className="proposals-head">
        <div className="text-white text-base not-italic font-medium">
          Proposals
        </div>
        <div className=" flex space-x-6">
          <button className="cstm-btn">
            <p className="text">All Proposals</p>
          </button>
          <button className="cstm-btn">
            <p className="text">Voting ending in 2 days</p>
          </button>
          <button className="cstm-btn">
            <p className="text">Show proposals in deposit</p>
          </button>
          <button className="cstm-btn">
            <p className="text">Recent proposals</p>
          </button>
        </div>
      </div>

      <div className="space-y-4 w-full">
        <div className="flex justify-between ">
          <div className="flex space-x-2">
            <Image
              src="./cosmos-logo.svg"
              width={32}
              height={32}
              alt="Cosmos-Logo"
            />
            <p className="flex items-center text-white text-base not-italic font-medium ">
              Cosmos
            </p>
          </div>
          <div className="view-history">View History</div>
        </div>
        <div className="v-line"></div>

        {proposalData.map((proposal, index) => (
          <div className="proposal" key={index}>
            <div className="proposal-id">
              <p className="text-white text-sm not-italic font-extralight leading-[14px]">
                {proposal.id}
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <p className="text-white text-sm not-italic font-normal leading-6">
                {proposal.title}
              </p>
              <div className="flex space-x-4">
                <div className="flex space-x-1">
                  <Image
                    src="./timer-logo.svg"
                    width={24}
                    height={24}
                    alt="Timer-Logo"
                  />
                  <p className=" flex items-center text-[rgba(255,255,255,0.75)] text-sm not-italic font-light leading-[14px]">
                    {proposal.expires}
                  </p>
                </div>
                <div className="flex space-x-1">
                  <Image
                    src="./vote-logo.svg"
                    width={24}
                    height={24}
                    alt="Vote-Logo"
                  />
                  <p className="flex items-center text-[rgba(255,255,255,0.75)] text-sm not-italic font-light leading-[14px]">
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

export default Proposals;
