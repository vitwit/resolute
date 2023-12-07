'use client';

import React from 'react';
import './style.css';
import TopNav from '@/components/TopNav';

type ProposalStatusUpdate = (status: string) => void;

const Proposals = ({
  handleChangeProposalState,
}: {
  handleChangeProposalState: ProposalStatusUpdate;
}) => {
  return (
    <div className="main-page">
      <div className="flex justify-between w-full">
        <div className="proposal-text-big">Governance</div>
        <TopNav />
      </div>

      <div className="proposals-head">
        <div className="text-[20px]">Proposals</div>
        <div className="flex space-x-6">
          <button
            className="cstm-btn"
            onClick={() => handleChangeProposalState('all')}
          >
            <p className="proposal-text-extralight">
              Proposals in voting period
            </p>
          </button>

          <button
            className="cstm-btn"
            onClick={() => handleChangeProposalState('deposit')}
          >
            <p className="proposal-text-extralight">
              Proposals in deposit period
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Proposals;
