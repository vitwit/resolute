'use client';
import React from 'react';
import Image from 'next/image';
import './style.css';
// import { RootState } from '@/store/store';
import TopNav from '@/components/TopNav';

// import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';

type ProposalStatusUpdate = (status: string) => void;

const Proposals = ({ 
  handleChangeProposalState }: { handleChangeProposalState: ProposalStatusUpdate  }) => {
  // const dispatch = useAppDispatch();
  // const networks = useAppSelector((state: RootState) => state.wallet.networks);


  return (
    <div className="main-page">
      <div className='flex justify-between w-full'>
      <div className='proposal-text-big'>Governance</div>
      <TopNav />
      </div>
      <div>
        <Image
          src="/ad.png"
          height={80}
          width={1800}
          alt="Advertisement-Image"
        />
      </div>
      <div className="proposals-head">
        <div className="proposal-text-medium">Proposals</div>
        <div className="flex space-x-6">
          <button className="cstm-btn" onClick={()=>handleChangeProposalState('all')}>
            <p className="proposal-text-extralight">All Proposals</p>
          </button>
          {/* <button className="cstm-btn" >
            <p className="proposal-text-extralight">Voting ending in 2 days</p>
          </button> */}
          <button className="cstm-btn" onClick={()=>handleChangeProposalState('deposit')}>
            <p className="proposal-text-extralight">
              Proposals in deposit period
            </p>
          </button>
        </div>
      </div>
{/* 
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
            <div className="flex justify-between items-center w-full">
              <div className="space-x-2 flex items-center">
                <div className="proposal-id">
                  <p className="proposal-text-extralight">{proposal.id}</p>
                </div>

                <p className="proposal-text-normal">{proposal.title}</p>
              </div>

              {!isRightBarOpen && (
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
                    <p className="proposal-text-small">
                      {proposal.votingStatus}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default Proposals;
