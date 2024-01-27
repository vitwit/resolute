'use client';

import React from 'react';
import './style.css';
import TopNav from '@/components/TopNav';
import AuthzToast from '@/components/AuthzToast';
import FeegrantToast from '@/components/FeegrantToast';

type ProposalStatusUpdate = (status: string) => void;

const Proposals = ({
  handleChangeProposalState,
  proposalStatus,
  chainIDs,
}: {
  handleChangeProposalState: ProposalStatusUpdate;
  proposalStatus: string;
  chainIDs: string[];
}) => {
  return (
    <div className="main-page">
      <div className="flex justify-between items-center w-full">
        <div className="proposal-text-big">Governance</div>

        <TopNav showAuthzButton={true} showFeegrantButton={true} />
      </div>
      <AuthzToast chainIDs={chainIDs} margins="w-full" />
      <FeegrantToast chainIDs={chainIDs} margins="w-full" />
      <div className="proposals-head">
        <div className="text-[20px]">Proposals</div>
        <div className="flex space-x-6">
          <button
            className={
              proposalStatus === 'active' ? 'cstm-btn-selected' : 'cstm-btn'
            }
            onClick={() => handleChangeProposalState('active')}
          >
            <p className="proposal-text-extralight">
              Proposals in voting period
            </p>
          </button>

          <button
            className={
              proposalStatus === 'deposit' ? 'cstm-btn-selected' : 'cstm-btn'
            }
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
