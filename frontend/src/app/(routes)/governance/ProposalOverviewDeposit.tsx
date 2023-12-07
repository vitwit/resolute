'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import './style.css';
import ProposalDetailsCard from './ProposalDetailsCard';
import DepositPopup from './DepositPopup';
import proposalOverviewData from './proposalDepositdata.json';

const ProposalOverviewDeposit = () => {
  const {
    proposalId,
    proposalText,
    proposalname,
    quorum,
    stake,
    submittedAt,
    endsAt,
    proposalNetwork,
    depositrequired,
    atomsValue,
  } = proposalOverviewData.proposalOverviewData;

  const [isDepositPopupOpen, setIsDepositPopupOpen] = useState(false);
  const handleCloseDepositPopup = () => {
    setIsDepositPopupOpen(false);
  };

  return (
    <div className="space-y-6 pl-10 pr-0 pt-6 pb-0">
      <div className="flex space-x-1">
        <Image
          src="/backarrow-icon.svg"
          width={24}
          height={24}
          alt="Go Back"
          className="cursor-pointer"
        />
        <div className="proposal-text-big">Proposal Overview</div>
      </div>
      <div className="flex gap-10">
        <div className="proposal-brief">
          <div className="proposal-div w-full">
            <div className="flex justify-between w-full">
              <div className="flex space-x-2">
                <Image
                  src="/cosmos-logo.svg"
                  width={40}
                  height={40}
                  alt="Cosmos-Logo"
                />
                <p className="proposal-text-normal flex items-center">
                  {proposalId} | Proposal
                </p>
              </div>
              <div>
                <button
                  className="button"
                  onClick={() => setIsDepositPopupOpen(true)}
                >
                  <p className="proposal-text-medium">Deposit</p>
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="proposal-text-medium">{proposalname}</div>

            <p className="proposal-text-normal">{proposalText}</p>
          </div>
        </div>

        <DepositPopup
          votingEndsInDays={'2'}
          denom={atomsValue}
          proposalId={123}
          chainID=""
          open={isDepositPopupOpen}
          onClose={handleCloseDepositPopup}
          proposalname={'Adjust Trade and Earn Rewards Margined Protocol'}
        />

        <div className="space-y-4">
          <div className="voting-grid">
            <div className="voting-view w-full">
              <div className="status-pass w-full">
                <div className="flex flex-col items-center space-y-2 w-full">
                  <div className="flex space-x-2 ">
                    <Image
                      src="/vote-icon.svg"
                      width={20}
                      height={20}
                      alt="Vote-Icon"
                    />
                    <p className="proposal-text-small">Deposit Collected</p>
                  </div>
                  <div>
                    <p className="proposal-text-big">{stake}Stake</p>
                  </div>
                </div>
              </div>
              <div className="w-full text-white flex flex-col justify-center items-center space-y-2">
                <div>100%</div>

                <div className="bg-white w-full h-[10px] rounded-full">
                  <div
                    className={
                      `bg-[#2DC5A4] h-[10px] rounded-l-full ` + `w-[${quorum}%]`
                    }
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <ProposalDetailsCard
            submittedAt={submittedAt}
            endsAt={endsAt}
            depositrequired={depositrequired}
            proposalNetwork={proposalNetwork}
          />
        </div>
      </div>
    </div>
  );
};

export default ProposalOverviewDeposit;
